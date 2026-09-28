export function createRingFieldSystem({ THREE, parent, count = 1600 }) {
  const geometry = new THREE.SphereGeometry(0.023, 5, 4);
  const material = new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.5, metalness: 0.5 });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.castShadow = true;
  parent.add(mesh);

  const bands = [
    { inner: 1.18, outer: 1.58, density: 0.92, rate: 0.105 },
    { inner: 1.72, outer: 2.18, density: 1.0, rate: 0.086 },
    { inner: 2.34, outer: 2.86, density: 0.82, rate: 0.069 }
  ];
  const particles = [];
  let seed = 0x51f15e;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const weights = bands.map(band => (band.outer - band.inner) * band.density);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  for (let i = 0; i < count; i += 1) {
    let pick = random() * totalWeight;
    let bandIndex = 0;
    while (bandIndex < bands.length - 1 && pick > weights[bandIndex]) pick -= weights[bandIndex++];
    const band = bands[bandIndex];
    const radius = band.inner + (band.outer - band.inner) * Math.sqrt(random());
    particles.push({
      radius,
      homeRadius: radius,
      angle: random() * Math.PI * 2,
      rate: band.rate * Math.pow(band.inner / radius, 1.5),
      verticalAmplitude: 0.008 + random() * 0.025,
      verticalFrequency: 0.22 + random() * 0.31,
      verticalPhase: random() * Math.PI * 2,
      radialPhase: random() * Math.PI * 2,
      disturbance: 0
    });
  }

  const dummy = new THREE.Object3D();
  const clearers = [];

  function addClearer(clearer) {
    clearers.push(clearer);
  }

  function update(dt, timeSeconds) {
    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];
      particle.angle = (particle.angle + particle.rate * dt) % (Math.PI * 2);
      const baseRadius = particle.homeRadius + Math.sin(timeSeconds * 0.12 + particle.radialPhase) * 0.012;
      let disturbance = 0;

      for (const clearer of clearers) {
        const orbit = clearer.orbit;
        const moonAngle = (orbit.phase ?? 0) + timeSeconds * orbit.rate;
        const angularDelta = Math.atan2(Math.sin(particle.angle - moonAngle), Math.cos(particle.angle - moonAngle));
        const radialDelta = baseRadius - orbit.radius;
        const distance = Math.hypot(radialDelta, angularDelta * orbit.radius);
        if (distance < clearer.influenceRadius) {
          const strength = 1 - distance / clearer.influenceRadius;
          disturbance = Math.max(disturbance, strength);
          particle.disturbance = Math.max(particle.disturbance, strength);
        }
      }

      particle.disturbance = Math.max(disturbance, particle.disturbance - dt * 0.34);
      const displacedRadius = baseRadius + particle.disturbance * 0.16 * Math.sign(Math.sin(particle.radialPhase) || 1);
      const y = Math.sin(timeSeconds * particle.verticalFrequency + particle.verticalPhase) * particle.verticalAmplitude
        + particle.disturbance * 0.035 * Math.sin(particle.angle * 7 + particle.verticalPhase);

      dummy.position.set(Math.cos(particle.angle) * displacedRadius, y, Math.sin(particle.angle) * displacedRadius);
      const scale = 0.7 + (i % 9) * 0.045;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  return { mesh, particles, bands, addClearer, update };
}
