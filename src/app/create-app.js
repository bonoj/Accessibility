import { createWorld } from "../core/ecs.js";
import { createCoreComponents } from "../core/components.js";
import { createEventBus } from "../core/events.js";
import { createThreeRuntime } from "../runtime/three-runtime.js";
import { createRenderSyncSystem } from "../runtime/render-sync.js";
import { createCameraSystem } from "../runtime/camera-system.js";
import { createOrbitSystem } from "../runtime/orbit-system.js";
import { createLightSystem } from "../runtime/light-system.js";
import { createSurfaceSystem } from "../runtime/surface-system.js";
import { createProductionSystem } from "../runtime/production-system.js";
import { createCollectionSystem } from "../runtime/collection-system.js";
import { adaptiveEntitySurfaceProbe } from "../probes/adaptive-entity-surface.js";

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
  const probe = adaptiveEntitySurfaceProbe.witness;
  world.add(witness, components.Surface, structuredClone(probe.surface));
  world.add(witness, components.SurfaceState, structuredClone(probe.surfaceState));
  world.add(witness, components.Producer, { kind: "bearing", intervalMs: 2200, produced: 0, nextAt: null });

  // A deliberately boring second entity proves that the adaptive surface belongs
  // to ECS identity rather than to bespoke Ball UI.
  const cube = world.entity();
  const cubeObject = new three.THREE.Mesh(
    new three.THREE.BoxGeometry(1.15, 1.15, 1.15),
    new three.THREE.MeshStandardMaterial({ color: 0xc8b9a8, roughness: 0.72, metalness: 0.03 })
  );
  cubeObject.castShadow = true;
  three.scene.add(cubeObject);
  world.add(cube, components.Transform, {
    position: new three.THREE.Vector3(2.15, 0.575, 0),
    rotation: new three.THREE.Euler(),
    scale: new three.THREE.Vector3(1, 1, 1),
    visible: true
  });
  world.add(cube, components.RenderObject, { object: cubeObject });
  world.add(cube, components.Surface, {
    title: "Cube",
    kicker: "ENTITY SURFACE",
    copy: {
      short: "A simple cube in the scene.",
      medium: "A simple cube in the scene. It uses the same adaptive surface machinery as the ball.",
      lots: "A simple cube in the scene. It uses the same adaptive surface machinery as the ball. This deliberately boring second entity exists to test whether semantic identity can travel cleanly from a spatial selection into one reusable DOM realization without giving the cube bespoke interface code."
    }
  });
  world.add(cube, components.SurfaceState, {
    ...structuredClone(probe.surfaceState),
    actionStatus: "Nothing has happened yet."
  });
  world.add(cube, components.Inventory, { accepts: "bearing", count: 0, capacity: 10 });

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

  const commonLimits = { minDistance: 1.5, maxDistance: 12, minPolar: 0.15, maxPolar: Math.PI - 0.15, minWorldY: 0.18 };
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
  const surfaces = createSurfaceSystem({ components, entity: witness });
  const production = createProductionSystem({ world, components, THREE: three.THREE, scene: three.scene });
  const collection = createCollectionSystem({ world, components, scene: three.scene });
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

  let lastFrame = performance.now();
  let frameHandle = null;
  function render(time = performance.now()) {
    const dt = Math.min(0.05, Math.max(0, (time - lastFrame) / 1000));
    lastFrame = time;
    production.update(time);
    collection.update(dt);

    const producer = components.Producer.get(witness);
    const inventory = components.Inventory.get(cube);
    const ballSurface = components.Surface.get(witness);
    const cubeSurface = components.Surface.get(cube);
    if (producer && ballSurface) ballSurface.copy.short = `A ball that has produced ${producer.produced} small brass balls.`;
    if (inventory && cubeSurface) cubeSurface.copy.short = `A cube holding ${inventory.count} of ${inventory.capacity} small brass balls.`;

    orbit.applyAll();
    lights.syncAll();
    renderSync();
    cameras.render();
    frameHandle = requestAnimationFrame(render);
  }
  render();

  return {
    world,
    components,
    events,
    three,
    systems: { renderSync, cameras, orbit, lights, surfaces, production, collection },
    entities: { witness, cube, overviewCamera, sideCamera, skyLight, keyLight },
    render,
    inspect: () => ({
      entities: world.alive.size,
      build: globalThis.__ACCESSIBILITY_BUILD__,
      pixelRatio: three.renderer.getPixelRatio(),
      activeCamera: cameras.activeId(),
      behavior: {
        producer: components.Producer.get(witness),
        inventory: components.Inventory.get(cube),
        looseCollectibles: world.query(components.Collectible).length
      },
      surface: {
        definition: components.Surface.get(witness),
        state: components.SurfaceState.get(witness)
      },
      lights: lights.inspect(),
      cameras: cameras.inspect().map(camera => ({
        ...camera,
        orbit: orbit.inspect(camera.id)
      }))
    })
  };
}
