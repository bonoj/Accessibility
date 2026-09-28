import { installOrbitInput } from "../runtime/orbit-input.js";

export function installInspection({ app, root }) {
  const world = root.querySelector("#world");
  const card = document.querySelector("#entity-card");
  const canvas = app.three.renderer.domElement;
  const raycaster = new app.three.THREE.Raycaster();
  const pointer = new app.three.THREE.Vector2();
  const starts = new Map();

  installOrbitInput({
    element: world,
    activeCamera: () => app.systems.cameras.activeId(),
    orbit: app.systems.orbit,
    render: app.render
  });

  function hitWitness(x, y) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    const cameraId = app.systems.cameras.activeId();
    const camera = cameraId == null ? null : app.components.CameraView.get(cameraId)?.camera;
    const object = app.components.RenderObject.get(app.entities.witness)?.object;
    if (!camera || !object) return false;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(object, false).length > 0;
  }

  function showCard(x, y) {
    if (!card) return;
    card.hidden = false;
    const margin = 12;
    const rect = card.getBoundingClientRect();
    card.style.left = Math.max(margin, Math.min(innerWidth - rect.width - margin, x + 18)) + "px";
    card.style.top = Math.max(margin, Math.min(innerHeight - rect.height - margin, y - rect.height / 2)) + "px";
  }

  world.addEventListener("pointerdown", event => {
    starts.set(event.pointerId, { x: event.clientX, y: event.clientY, t: performance.now() });
  });

  world.addEventListener("pointerup", event => {
    const start = starts.get(event.pointerId);
    starts.delete(event.pointerId);
    if (!start) return;
    const travel = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (travel < 10 && performance.now() - start.t < 420 && hitWitness(event.clientX, event.clientY)) {
      showCard(event.clientX, event.clientY);
    }
  });

  world.addEventListener("pointercancel", event => starts.delete(event.pointerId));
}
