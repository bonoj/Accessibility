import { createWorld } from "../core/ecs.js";
import { createCoreComponents } from "../core/components.js";
import { createEventBus } from "../core/events.js";
import { createThreeRuntime } from "../runtime/three-runtime.js";
import { createRenderSyncSystem } from "../runtime/render-sync.js";
import { createCameraSystem } from "../runtime/camera-system.js";
import { createOrbitSystem } from "../runtime/orbit-system.js";
import { createLightSystem } from "../runtime/light-system.js";

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

  // Minimal physical scene: a real floor rather than an orientation-only grid.
  const floor = new three.THREE.Mesh(
    new three.THREE.PlaneGeometry(18, 18),
    new three.THREE.MeshStandardMaterial({ color: 0xe5e3dc, roughness: 0.92 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  three.scene.add(floor);
  world.add(witness, components.Transform, {
    position: new three.THREE.Vector3(0, 1.05, 0),
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
  const lights = createLightSystem({ world, components, three });
  orbit.applyAll();

  function addLight({ name, kind, color, groundColor, intensity, position, castShadow = false }) {
    const id = world.entity();
    world.add(id, components.Transform, {
      position: new three.THREE.Vector3(...position),
      rotation: new three.THREE.Euler(),
      scale: new three.THREE.Vector3(1, 1, 1),
      visible: true
    });
    world.add(id, components.Light, { name, kind, color, groundColor, intensity, castShadow });
    return id;
  }

  const skyLight = addLight({ name: "Sky", kind: "hemisphere", color: 0xfffbf2, groundColor: 0xb9b8b2, intensity: 2.2, position: [0, 5, 0] });
  const keyLight = addLight({ name: "Key", kind: "directional", color: 0xfff5df, intensity: 2.4, position: [4, 7, 5], castShadow: true });
  lights.syncAll();

  function render() {
    orbit.applyAll();
    lights.syncAll();
    renderSync();
    cameras.render();
  }
  render();

  return {
    world,
    components,
    events,
    three,
    systems: { renderSync, cameras, orbit, lights },
    entities: { witness, overviewCamera, sideCamera, skyLight, keyLight },
    render,
    inspect: () => ({
      entities: world.alive.size,
      build: globalThis.__ACCESSIBILITY_BUILD__,
      pixelRatio: three.renderer.getPixelRatio(),
      activeCamera: cameras.activeId(),
      lights: lights.inspect(),
      cameras: cameras.inspect().map(camera => ({
        ...camera,
        orbit: orbit.inspect(camera.id)
      }))
    })
  };
}
