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
      disturbance: 0,
      present: true,
      claimedBy: null,
      pull: 0
    });
  }

  const dummy = new THREE.Object3D();
  const clearers = [];
  const collectors = [];

  function addClearer(clearer) {
    clearers.push(clearer);
  }

  function addCollector(collector) {
    collectors.push(collector);
  }

  function update(dt, timeSeconds) {
    const positions = new Array(particles.length);

    // First let the ring and perturbation systems establish this frame's natural
    // particle positions. Collection competes with that result rather than
    // replacing orbital behavior.
    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];
      if (!particle.present) continue;
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
      positions[i] = {
        x: Math.cos(particle.angle) * displacedRadius,
        y: Math.sin(timeSeconds * particle.verticalFrequency + particle.verticalPhase) * particle.verticalAmplitude
          + particle.disturbance * 0.035 * Math.sin(particle.angle * 7 + particle.verticalPhase),
        z: Math.sin(particle.angle) * displacedRadius
      };
    }

    // Each collector owns at most one claim. If idle, it claims the nearest
    // currently realized particle inside acquisition range.
    for (const collector of collectors) {
      let claimedIndex = particles.findIndex(particle => particle.present && particle.claimedBy === collector);
      if (claimedIndex < 0) {
        let nearestIndex = -1;
        let nearestDistance = collector.acquisitionRadius;
        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];
          const position = positions[i];
          if (!particle.present || particle.claimedBy || !position) continue;
          const distance = Math.hypot(
            position.x - collector.localPosition.x,
            position.y - collector.localPosition.y,
            position.z - collector.localPosition.z
          );
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = i;
          }
        }
        if (nearestIndex >= 0) {
          particles[nearestIndex].claimedBy = collector;
          particles[nearestIndex].pull = 0;
          claimedIndex = nearestIndex;
        }
      }

      if (claimedIndex >= 0) {
        const particle = particles[claimedIndex];
        const position = positions[claimedIndex];
        particle.pull = Math.min(1, particle.pull + dt * collector.pullRate);
        const eased = particle.pull * particle.pull * (3 - 2 * particle.pull);
        position.x += (collector.localPosition.x - position.x) * eased;
        position.y += (collector.localPosition.y - position.y) * eased;
        position.z += (collector.localPosition.z - position.z) * eased;

        const distance = Math.hypot(
          position.x - collector.localPosition.x,
          position.y - collector.localPosition.y,
          position.z - collector.localPosition.z
        );
        if (distance <= collector.captureRadius || particle.pull >= 1) {
          particle.present = false;
          particle.claimedBy = null;
          particle.pull = 0;
          collector.collect(1);
        }
      }
    }

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];
      const position = positions[i];
      if (!particle.present || !position) {
        dummy.position.set(0, -1000, 0);
        dummy.scale.setScalar(0);
      } else {
        dummy.position.set(position.x, position.y, position.z);
        dummy.scale.setScalar(0.7 + (i % 9) * 0.045);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  return { mesh, particles, bands, addClearer, addCollector, update };
}
