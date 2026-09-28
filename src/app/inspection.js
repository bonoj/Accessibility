import { installOrbitInput } from "../runtime/orbit-input.js";

export function installInspection({ app, root }) {
  const world = root.querySelector("#world");
  const surface = app.systems.surfaces;
  const canvas = app.three.renderer.domElement;
  const raycaster = new app.three.THREE.Raycaster();
  const pointer = new app.three.THREE.Vector2();
  const starts = new Map();

  installOrbitInput({
    element: world,
    activeCamera: () => app.systems.cameras.activeId(),
    orbit: app.systems.orbit
  });

  function hitSurfaceEntity(x, y) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    const cameraId = app.systems.cameras.activeId();
    const camera = cameraId == null ? null : app.components.CameraView.get(cameraId)?.camera;
    if (!camera) return null;
    const candidates = [app.entities.witness, app.entities.cube]
      .map(entity => ({ entity, object: app.components.RenderObject.get(entity)?.object }))
      .filter(candidate => candidate.object);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(candidates.map(candidate => candidate.object), false);
    if (!hits.length) return null;
    return candidates.find(candidate => candidate.object === hits[0].object)?.entity ?? null;
  }

  world.addEventListener("pointerdown", event => {
    starts.set(event.pointerId, { x: event.clientX, y: event.clientY, t: performance.now() });
  });

  world.addEventListener("pointerup", event => {
    const start = starts.get(event.pointerId);
    starts.delete(event.pointerId);
    if (!start) return;
    const travel = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (travel < 10 && performance.now() - start.t < 420) {
      const entity = hitSurfaceEntity(event.clientX, event.clientY);
      if (entity != null) {
        // The selecting gesture must finish against the world it began in.
        // Realize interactive DOM on the next frame so the opening tap cannot
        // become a synthetic click on the newly appeared surface.
        requestAnimationFrame(() => surface.openAt(event.clientX, event.clientY, entity));
      }
    }
  });

  world.addEventListener("pointercancel", event => starts.delete(event.pointerId));
}
