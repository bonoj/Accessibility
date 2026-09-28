import { createWorld } from "../core/ecs.js";
import { createCoreComponents } from "../core/components.js";
import { createEventBus } from "../core/events.js";
import { createThreeRuntime } from "../runtime/three-runtime.js";
import { createRenderSyncSystem } from "../runtime/render-sync.js";
import { createCameraSystem } from "../runtime/camera-system.js";
import { createOrbitSystem } from "../runtime/orbit-system.js";
import { createLightSystem } from "../runtime/light-system.js";
import { createSurfaceSystem } from "../runtime/surface-system.js";
import { createCollectionSystem } from "../runtime/collection-system.js";
import { createOrbitalSystem } from "../runtime/orbital-system.js";
import { createRingFieldSystem } from "../runtime/ring-field-system.js";
import { adaptiveEntitySurfaceProbe } from "../probes/adaptive-entity-surface.js";

export function createApp({ worldMount, diagnostics }) {
  const world = createWorld();
  const components = createCoreComponents(world);
  const events = createEventBus();
  const three = createThreeRuntime({ mount: worldMount, diagnostics });
  const renderSync = createRenderSyncSystem({ world, components });

  const witness = world.entity();
  const saturn = new three.THREE.Group();
  saturn.rotation.z = -0.16;
  const planet = new three.THREE.Mesh(
    new three.THREE.SphereGeometry(0.82, 32, 20),
    new three.THREE.MeshStandardMaterial({ color: 0xc9b88d, roughness: 0.76, metalness: 0.02 })
  );
  planet.scale.y = 0.91;
  planet.castShadow = true;
  saturn.add(planet);
  three.scene.add(saturn);
  const object = saturn;
  const ringField = createRingFieldSystem({ THREE: three.THREE, parent: saturn, count: 1600 });

  // Minimal physical scene: a real floor rather than an orientation-only grid.
  const floor = new three.THREE.Mesh(
    new three.THREE.PlaneGeometry(18, 18),
    new three.THREE.MeshStandardMaterial({ color: 0xe5e3dc, roughness: 0.92 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  three.scene.add(floor);
  world.add(witness, components.Transform, {
    position: new three.THREE.Vector3(0, 2.55, 0),
    rotation: new three.THREE.Euler(),
    scale: new three.THREE.Vector3(1, 1, 1),
    visible: true
  });
  world.add(witness, components.RenderObject, { object });
  const probe = adaptiveEntitySurfaceProbe.witness;
  world.add(witness, components.Surface, structuredClone(probe.surface));
  world.add(witness, components.SurfaceState, structuredClone(probe.surfaceState));
  const moonSpecs = [
    { radius: 3.35, size: 0.13, rate: 0.32, phase: 0.0 },
    { radius: 3.85, size: 0.16, rate: 0.16, phase: 1.75 },
    { radius: 4.45, size: 0.20, rate: 0.08, phase: 3.45 }
  ];
  const resonantMoons = moonSpecs.map((spec, index) => {
    const id = world.entity();
    const moon = new three.THREE.Mesh(
      new three.THREE.SphereGeometry(spec.size, 12, 8),
      new three.THREE.MeshStandardMaterial({ color: 0xd7d3c8, roughness: 0.88 })
    );
    moon.castShadow = true;
    saturn.add(moon);
    world.add(id, components.OrbitingBody, {
      object: moon, radius: spec.radius, rate: spec.rate, phase: spec.phase,
      verticalAmplitude: 0.035 + index * 0.012, verticalFrequency: 0.7
    });
    return id;
  });

  const clearingMoon = world.entity();
  const clearingMoonObject = new three.THREE.Mesh(
    new three.THREE.SphereGeometry(0.09, 12, 8),
    new three.THREE.MeshStandardMaterial({ color: 0xe4dfd2, roughness: 0.9 })
  );
  clearingMoonObject.castShadow = true;
  saturn.add(clearingMoonObject);
  const clearingOrbit = {
    object: clearingMoonObject, radius: 2.27, rate: 0.095, phase: 0.8,
    verticalAmplitude: 0.055, verticalFrequency: 0.9
  };
  world.add(clearingMoon, components.OrbitingBody, clearingOrbit);
  ringField.addClearer({ orbit: clearingOrbit, influenceRadius: 0.26 });

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
  const cubeInventory = world.add(cube, components.Inventory, { accepts: "ring-matter", count: 0, capacity: Infinity });
  // Cube is outside the tilted Saturn group, so express its center in ring-local
  // coordinates once. The ring field can then surrender nearby matter directly.
  const cubeWorldPosition = components.Transform.get(cube).position.clone();
  const cubeLocalPosition = saturn.worldToLocal(cubeWorldPosition.clone());
  ringField.addCollector({
    localPosition: cubeLocalPosition,
    acquisitionRadius: 3.4,
    captureRadius: 0.16,
    pullRate: 0.62,
    collect(amount) { cubeInventory.count += amount; }
  });

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
    position: [0, 3.8, 7.8],
    orbit: { azimuth: 0, polar: 1.159, distance: 8.2, ...commonLimits }
  });
  const sideCamera = addCamera({
    name: "Side",
    position: [7.2, 3.0, 0.6],
    fov: 42,
    orbit: { azimuth: 1.494, polar: 1.345, distance: 7.5, ...commonLimits }
  });
  world.add(overviewCamera, components.ActiveCamera, true);

  const orbit = createOrbitSystem({ world, components, THREE: three.THREE });
  const cameras = createCameraSystem({ world, components, three });
  const lights = createLightSystem({ world, components, three });
  const surfaces = createSurfaceSystem({ components, entity: witness });
  const collection = createCollectionSystem({ world, components, scene: three.scene });
  const orbital = createOrbitalSystem({ world, components });
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
  let fpsWindowStart = lastFrame;
  let fpsFrames = 0;
  const fpsCounter = document.querySelector("#fps-counter");

  function draw() {
    orbit.applyAll();
    lights.syncAll();
    renderSync();
    cameras.render();
  }

  function frame(time) {
    const elapsed = time / 1000;
    const dt = Math.min(0.05, Math.max(0, (time - lastFrame) / 1000));
    lastFrame = time;
    fpsFrames += 1;
    if (time - fpsWindowStart >= 500) {
      if (fpsCounter) fpsCounter.textContent = `fps ${Math.round(fpsFrames * 1000 / (time - fpsWindowStart))}`;
      fpsWindowStart = time;
      fpsFrames = 0;
    }

    orbital.update(elapsed);
    ringField.update(dt, elapsed);
    collection.update(dt);

    const inventory = components.Inventory.get(cube);
    const ballSurface = components.Surface.get(witness);
    const cubeSurface = components.Surface.get(cube);
    if (ballSurface) ballSurface.copy.short = `A living orbital field of 1,600 brass bearings, resonant moons, and local perturbations.`;
    if (inventory && cubeSurface) cubeSurface.copy.short = `A cube that has stolen ${inventory.count} ring particles. It has no capacity limit.`;
    surfaces.refreshOpen();

    draw();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  return {
    world,
    components,
    events,
    three,
    systems: { renderSync, cameras, orbit, lights, surfaces, collection, orbital, ringField },
    entities: { witness, cube, resonantMoons, clearingMoon, overviewCamera, sideCamera, skyLight, keyLight },
    inspect: () => ({
      entities: world.alive.size,
      build: globalThis.__ACCESSIBILITY_BUILD__,
      pixelRatio: three.renderer.getPixelRatio(),
      activeCamera: cameras.activeId(),
      behavior: {
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
