export function createLightSystem({ world, components, three }) {
  const { Transform, Light, LightView } = components;

  function realize(id) {
    const spec = Light.get(id);
    let light = LightView.get(id)?.light;
    if (light) return light;

    if (spec.kind === "hemisphere") {
      light = new three.THREE.HemisphereLight(spec.color, spec.groundColor, spec.intensity);
    } else if (spec.kind === "ambient") {
      light = new three.THREE.AmbientLight(spec.color, spec.intensity);
    } else {
      light = new three.THREE.DirectionalLight(spec.color, spec.intensity);
    }

    light.castShadow = Boolean(spec.castShadow);
    three.scene.add(light);
    world.add(id, LightView, { light });
    return light;
  }

  function syncAll() {
    for (const id of world.query(Light, Transform)) {
      const spec = Light.get(id);
      const transform = Transform.get(id);
      const light = realize(id);
      light.color?.setHex(spec.color);
      light.intensity = spec.intensity;
      if (light.groundColor && spec.groundColor != null) light.groundColor.setHex(spec.groundColor);
      if (transform.position) light.position.copy(transform.position);
    }
  }

  function inspect() {
    return world.query(Light, Transform).map(id => {
      const spec = Light.get(id);
      const transform = Transform.get(id);
      return {
        id,
        name: spec.name,
        kind: spec.kind,
        intensity: spec.intensity,
        position: transform.position?.toArray().map(n => Number(n.toFixed(2))) ?? null,
        realizedAs: LightView.get(id)?.light?.type ?? null
      };
    });
  }

  return { syncAll, inspect };
}
