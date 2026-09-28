const TAU = Math.PI * 2;
const EPSILON = 0.03;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function createOrbitSystem({ world, components, THREE }) {
  const { Transform, CameraTarget, OrbitBehavior } = components;

  function apply(id) {
    const orbit = OrbitBehavior.get(id);
    const transform = Transform.get(id);
    const relation = CameraTarget.get(id);
    if (!orbit || !transform || relation?.entity == null) return false;

    const target = Transform.get(relation.entity);
    if (!target?.position) return false;

    orbit.azimuth = ((orbit.azimuth % TAU) + TAU) % TAU;
    orbit.polar = clamp(orbit.polar, orbit.minPolar ?? EPSILON, orbit.maxPolar ?? Math.PI - EPSILON);
    orbit.distance = clamp(orbit.distance, orbit.minDistance ?? 1, orbit.maxDistance ?? 20);

    const sinPolar = Math.sin(orbit.polar);
    const offset = new THREE.Vector3(
      orbit.distance * sinPolar * Math.sin(orbit.azimuth),
      orbit.distance * Math.cos(orbit.polar),
      orbit.distance * sinPolar * Math.cos(orbit.azimuth)
    );
    transform.position.copy(target.position).add(offset);
    return true;
  }

  function applyAll() {
    for (const id of world.query(OrbitBehavior, Transform, CameraTarget)) apply(id);
  }

  function adjust(id, { azimuth = 0, polar = 0, distance = 0 } = {}) {
    const orbit = OrbitBehavior.get(id);
    if (!orbit) return false;
    orbit.azimuth += azimuth;
    orbit.polar += polar;
    orbit.distance += distance;
    return apply(id);
  }

  function inspect(id) {
    const orbit = OrbitBehavior.get(id);
    if (!orbit) return null;
    return {
      azimuthDegrees: Number((orbit.azimuth * 180 / Math.PI).toFixed(1)),
      polarDegrees: Number((orbit.polar * 180 / Math.PI).toFixed(1)),
      distance: Number(orbit.distance.toFixed(2)),
      limits: {
        distance: [orbit.minDistance, orbit.maxDistance],
        polarDegrees: [
          Number((orbit.minPolar * 180 / Math.PI).toFixed(1)),
          Number((orbit.maxPolar * 180 / Math.PI).toFixed(1))
        ]
      }
    };
  }

  return { apply, applyAll, adjust, inspect };
}
