export function createProductionSystem({ world, components, THREE, scene, now = () => performance.now() }) {
  const { Producer, Transform, RenderObject, Collectible } = components;

  function spawn(producerId) {
    const producer = Producer.get(producerId);
    const source = Transform.get(producerId);
    if (!producer || !source) return null;

    const id = world.entity();
    const angle = producer.produced * 2.399963229728653;
    const radius = 0.9 + (producer.produced % 3) * 0.08;
    const position = source.position.clone().add(new THREE.Vector3(
      Math.cos(angle) * radius,
      -0.82,
      Math.sin(angle) * radius
    ));
    const object = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.48, metalness: 0.58 })
    );
    object.castShadow = true;
    scene.add(object);

    world.add(id, Transform, {
      position,
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      visible: true
    });
    world.add(id, RenderObject, { object });
    world.add(id, Collectible, { kind: producer.kind, source: producerId });
    producer.produced += 1;
    return id;
  }

  function update(time = now()) {
    for (const id of world.query(Producer, Transform)) {
      const producer = Producer.get(id);
      if (producer.nextAt == null) producer.nextAt = time + producer.intervalMs;
      if (time < producer.nextAt) continue;
      spawn(id);
      producer.nextAt = time + producer.intervalMs;
    }
  }

  return { update, spawn };
}
