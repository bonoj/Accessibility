export function createCollectionSystem({ world, components, scene }) {
  const { Inventory, Collectible, Transform, RenderObject } = components;

  function update(dt) {
    const collectors = world.query(Inventory, Transform);
    for (const itemId of world.query(Collectible, Transform)) {
      const item = Collectible.get(itemId);
      const itemTransform = Transform.get(itemId);

      let targetId = null;
      let targetDistance = Infinity;
      for (const collectorId of collectors) {
        const inventory = Inventory.get(collectorId);
        if (inventory.count >= inventory.capacity) continue;
        if (inventory.accepts && inventory.accepts !== item.kind) continue;
        const distance = itemTransform.position.distanceTo(Transform.get(collectorId).position);
        if (distance < targetDistance) {
          targetDistance = distance;
          targetId = collectorId;
        }
      }
      if (targetId == null) continue;

      const target = Transform.get(targetId).position;
      const delta = target.clone().sub(itemTransform.position);
      const distance = delta.length();
      const step = Math.min(distance, 1.15 * dt);
      if (distance > 0) itemTransform.position.addScaledVector(delta.normalize(), step);

      if (distance <= 0.34) {
        const inventory = Inventory.get(targetId);
        inventory.count += 1;
        const object = RenderObject.get(itemId)?.object;
        if (object) scene.remove(object);
        world.destroy(itemId);
      }
    }
  }

  return { update };
}
