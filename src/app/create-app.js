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
  const saturn = new three.THREE.Group();
  const planet = new three.THREE.Mesh(
    new three.THREE.SphereGeometry(0.82, 32, 20),
    new three.THREE.MeshStandardMaterial({ color: 0xc9b88d, roughness: 0.76, metalness: 0.02 })
  );
  planet.scale.y = 0.91;
  planet.castShadow = true;
  saturn.add(planet);

  // A thousand individually visible bearings make the rings without turning them
  // into a single opaque mesh. Deliberate radial gaps keep the bands legible.
  const ringGeometry = new three.THREE.SphereGeometry(0.025, 5, 4);
  const ringMaterial = new three.THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.5, metalness: 0.5 });
  const rings = new three.THREE.InstancedMesh(ringGeometry, ringMaterial, 1000);
  const dummy = new three.THREE.Object3D();
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const allowedBands = [[1.15, 1.38], [1.47, 1.72], [1.82, 2.08]];
  for (let i = 0; i < 1000; i += 1) {
    const band = allowedBands[i % allowedBands.length];
    const t = ((i * 0.6180339887498949) % 1);
    const radius = band[0] + (band[1] - band[0]) * t;
    const angle = i * goldenAngle;
    dummy.position.set(Math.cos(angle) * radius, (Math.sin(i * 12.9898) * 0.018), Math.sin(angle) * radius);
    dummy.scale.setScalar(0.72 + (i % 7) * 0.055);
    dummy.updateMatrix();
    rings.setMatrixAt(i, dummy.matrix);
  }
  rings.instanceMatrix.needsUpdate = true;
  rings.castShadow = true;
  saturn.add(rings);

  // Three moons orbit in a 4:2:1 angular-frequency resonance. Their motion is
  // intentionally slow enough to read as a system rather than decorative jitter.
  const moonSpecs = [
    { radius: 2.55, size: 0.13, rate: 0.32, phase: 0.0 },
    { radius: 3.02, size: 0.16, rate: 0.16, phase: 1.75 },
    { radius: 3.55, size: 0.20, rate: 0.08, phase: 3.45 }
  ];
  const moons = moonSpecs.map(spec => {
    const moon = new three.THREE.Mesh(
      new three.THREE.SphereGeometry(spec.size, 12, 8),
      new three.THREE.MeshStandardMaterial({ color: 0xd7d3c8, roughness: 0.88 })
    );
    moon.castShadow = true;
    saturn.add(moon);
    return { ...spec, object: moon };
  });
  three.scene.add(saturn);
  const object = saturn;

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
    for (const moon of moons) {
      const angle = moon.phase + elapsed * moon.rate;
      moon.object.position.set(Math.cos(angle) * moon.radius, 0.08 * Math.sin(angle * 0.7), Math.sin(angle) * moon.radius);
    }

    const dt = Math.min(0.05, Math.max(0, (time - lastFrame) / 1000));
    lastFrame = time;
    fpsFrames += 1;
    if (time - fpsWindowStart >= 500) {
      if (fpsCounter) fpsCounter.textContent = `fps ${Math.round(fpsFrames * 1000 / (time - fpsWindowStart))}`;
      fpsWindowStart = time;
      fpsFrames = 0;
    }

    production.update(time);
    collection.update(dt);

    const producer = components.Producer.get(witness);
    const inventory = components.Inventory.get(cube);
    const ballSurface = components.Surface.get(witness);
    const cubeSurface = components.Surface.get(cube);
    if (producer && ballSurface) ballSurface.copy.short = `Saturn: 1,000 brass bearings in cleared ring bands, three moons in 4:2:1 orbital resonance, and ${producer.produced} loose brass balls produced.`;
    if (inventory && cubeSurface) cubeSurface.copy.short = `A cube holding ${inventory.count} of ${inventory.capacity} small brass balls.`;
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
    systems: { renderSync, cameras, orbit, lights, surfaces, production, collection },
    entities: { witness, cube, overviewCamera, sideCamera, skyLight, keyLight },
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
