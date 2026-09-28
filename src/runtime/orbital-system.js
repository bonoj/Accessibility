export function createOrbitalSystem({ world, components }) {
  const { OrbitingBody } = components;

  function update(timeSeconds) {
    for (const id of world.query(OrbitingBody)) {
      const orbit = OrbitingBody.get(id);
      if (!orbit?.object) continue;
      const angle = (orbit.phase ?? 0) + timeSeconds * orbit.rate;
      orbit.object.position.set(
        Math.cos(angle) * orbit.radius,
        (orbit.verticalAmplitude ?? 0) * Math.sin(angle * (orbit.verticalFrequency ?? 0.7) + (orbit.verticalPhase ?? 0)),
        Math.sin(angle) * orbit.radius
      );
    }
  }

  return { update };
}
