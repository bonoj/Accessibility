import { createWorld } from "../core/ecs.js";
import { createCoreComponents } from "../core/components.js";
import { createEventBus } from "../core/events.js";
import { createThreeRuntime } from "../runtime/three-runtime.js";
import { createRenderSyncSystem } from "../runtime/render-sync.js";
import { createCameraSystem } from "../runtime/camera-system.js";
import { createOrbitSystem } from "../runtime/orbit-system.js";

export function createApp({ worldMount, diagnostics }) {
  const world = createWorld();
  const components = createCoreComponents(world);
  const events = createEventBus();
  const three = createThreeRuntime({ mount: worldMount, diagnostics });
  const renderSync = createRenderSyncSystem({ world, components });

  const witness = world.entity();
  const object = new three.THREE.Mesh(
    new three.THREE.IcosahedronGeometry(0.72, 2),
    new three.THREE.MeshStandardMaterial({ color: 0xb8c4ca, roughness: 0.68, metalness: 0.04 })
  );
  object.castShadow = true;
  three.scene.add(object);

  // Orientation witness: world-fixed ground makes camera motion perceptible without labels.
  const grid = new three.THREE.GridHelper(14, 14, 0x777777, 0xc8c8c8);
  grid.position.y = -1.05;
  three.scene.add(grid);
  world.add(witness, components.Transform, {
    position: new three.THREE.Vector3(0, 0, 0),
    rotation: new three.THREE.Euler(),
    scale: new three.THREE.Vector3(1, 1, 1),
    visible: true
  });
  world.add(witness, components.RenderObject, { object });

  function addCamera({ name, projection = "perspective", position, orbit, fov = 48, height = 5 }) {
    const id = world.entity();
    world.add(id, components.Transform, {
      position: new three.THREE.Vector3(...position),
      rotation: new three.THREE.Euler(),
      scale: new three.THREE.Vector3(1, 1, 1),
      visible: true
    });
    world.add(id, components.Camera, { name, projection, fov, height, near: 0.03, far: 1000 });
    world.add(id, components.CameraTarget, { entity: witness });
    world.add(id, components.Viewport, { slot: "primary" });
    if (orbit) world.add(id, components.OrbitBehavior, orbit);
    return id;
  }

  const commonLimits = { minDistance: 1.5, maxDistance: 12, minPolar: 0.15, maxPolar: Math.PI - 0.15 };
  const overviewCamera = addCamera({
    name: "Overview",
    position: [0, 2.4, 5.5],
    orbit: { azimuth: 0, polar: 1.159, distance: 6, ...commonLimits }
  });
  const sideCamera = addCamera({
    name: "Side",
    position: [5.2, 1.2, 0.4],
    fov: 42,
    orbit: { azimuth: 1.494, polar: 1.345, distance: 5.35, ...commonLimits }
  });
  world.add(overviewCamera, components.ActiveCamera, true);

  const orbit = createOrbitSystem({ world, components, THREE: three.THREE });
  const cameras = createCameraSystem({ world, components, three });
  orbit.applyAll();

  three.scene.add(new three.THREE.HemisphereLight(0xfffbf2, 0xb9b8b2, 2.2));
  const key = new three.THREE.DirectionalLight(0xfff5df, 2.4);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  three.scene.add(key);

  function render() {
    orbit.applyAll();
    renderSync();
    cameras.render();
  }
  render();

  return {
    world,
    components,
    events,
    three,
    systems: { renderSync, cameras, orbit },
    entities: { witness, overviewCamera, sideCamera },
    render,
    inspect: () => ({
      entities: world.alive.size,
      build: globalThis.__ACCESSIBILITY_BUILD__,
      pixelRatio: three.renderer.getPixelRatio(),
      activeCamera: cameras.activeId(),
      cameras: cameras.inspect().map(camera => ({
        ...camera,
        orbit: orbit.inspect(camera.id)
      }))
    })
  };
}
