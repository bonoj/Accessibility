import { createWorld } from "../core/ecs.js";
import { createCoreComponents } from "../core/components.js";
import { createEventBus } from "../core/events.js";
import { createThreeRuntime } from "../runtime/three-runtime.js";
import { createRenderSyncSystem } from "../runtime/render-sync.js";

export function createApp({ worldMount, diagnostics }) {
  const world = createWorld();
  const components = createCoreComponents(world);
  const events = createEventBus();
  const three = createThreeRuntime({ mount: worldMount, diagnostics });
  const renderSync = createRenderSyncSystem({ world, components });

  // T0 witness only: proves semantic Transform -> disposable Three.js view.
  // It deliberately earns no construction vocabulary.
  const id = world.entity();
  const object = new three.THREE.Mesh(
    new three.THREE.IcosahedronGeometry(0.72, 2),
    new three.THREE.MeshStandardMaterial({
      color: 0xe6e2d8,
      roughness: 0.72,
      metalness: 0.04
    })
  );
  object.castShadow = true;
  three.scene.add(object);

  world.add(id, components.Transform, {
    position: new three.THREE.Vector3(0, 0, 0),
    rotation: new three.THREE.Euler(),
    scale: new three.THREE.Vector3(1, 1, 1),
    visible: true
  });
  world.add(id, components.RenderObject, { object });

  three.scene.add(new three.THREE.HemisphereLight(0xfffbf2, 0xb9b8b2, 2.2));
  const key = new three.THREE.DirectionalLight(0xfff5df, 2.4);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  three.scene.add(key);

  renderSync();
  three.render();

  return {
    world,
    components,
    events,
    three,
    systems: { renderSync },
    inspect: () => ({
      entities: world.alive.size,
      build: globalThis.__ACCESSIBILITY_BUILD__,
      pixelRatio: three.renderer.getPixelRatio()
    })
  };
}
