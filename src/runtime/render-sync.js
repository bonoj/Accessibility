export function createRenderSyncSystem({ world, components }) {
  const { Transform, RenderObject } = components;

  return function renderSyncSystem() {
    for (const id of world.query(Transform, RenderObject)) {
      const transform = Transform.get(id);
      const render = RenderObject.get(id);
      const object = render?.object;
      if (!object) continue;

      if (transform.position) object.position.copy(transform.position);
      if (transform.rotation) object.rotation.copy(transform.rotation);
      if (transform.quaternion) object.quaternion.copy(transform.quaternion);
      if (transform.scale) object.scale.copy(transform.scale);
      object.visible = transform.visible ?? true;
    }
  };
}
