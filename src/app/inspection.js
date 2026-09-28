import { installOrbitInput } from "../runtime/orbit-input.js";

export function installInspection({ app, root }) {
  const world = root.querySelector("#world");
  const card = document.querySelector("#entity-card");
  const quantity = document.querySelector("#text-quantity");
  const fontSize = document.querySelector("#font-size");
  const slider = document.querySelector("#amount-slider");
  const action = document.querySelector("#ball-action");
  const expand = document.querySelector("#surface-expand");
  const collapse = document.querySelector("#surface-collapse");
  const dismiss = document.querySelector("#surface-dismiss");
  const variant = document.querySelector("#surface-variant");
  const surface = app.systems.surfaces;
  const canvas = app.three.renderer.domElement;
  const raycaster = new app.three.THREE.Raycaster();
  const pointer = new app.three.THREE.Vector2();
  const starts = new Map();
  const surfacePointers = new Map();
  let pinchStartDistance = 0;
  let pinchStartScale = 1;

  installOrbitInput({
    element: world,
    activeCamera: () => app.systems.cameras.activeId(),
    orbit: app.systems.orbit,
    render: app.render
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

  quantity?.addEventListener("change", () => surface.patch({ textQuantity: quantity.value }));
  fontSize?.addEventListener("change", () => surface.patch({ fontSize: fontSize.value }));
  slider?.addEventListener("input", () => surface.patch({ amount: Number(slider.value) }));
  action?.addEventListener("click", () => {
    const name = surface.definition.title.toLowerCase();
    surface.patch({ actionStatus: `The ${name} noticed. The control works.` });
  });
  expand?.addEventListener("click", () => surface.toggleExpanded());
  collapse?.addEventListener("click", () => surface.toggleCollapsed());
  dismiss?.addEventListener("click", () => surface.dismiss());
  variant?.addEventListener("change", () => surface.patch({ variant: variant.value }));

  if (card) {
    card.addEventListener("pointerdown", event => {
      if (event.pointerType !== "touch") return;
      surfacePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (surfacePointers.size === 2) {
        const [a, b] = [...surfacePointers.values()];
        pinchStartDistance = Math.hypot(a.x - b.x, a.y - b.y);
        pinchStartScale = surface.state.pinchScale;
      }
    });

    card.addEventListener("pointermove", event => {
      if (!surfacePointers.has(event.pointerId)) return;
      surfacePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (surfacePointers.size !== 2 || pinchStartDistance <= 0) return;
      const [a, b] = [...surfacePointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const pinchScale = Math.max(0.8, Math.min(3, pinchStartScale * distance / pinchStartDistance));
      surface.patch({ pinchScale });
    });

    const release = event => {
      surfacePointers.delete(event.pointerId);
      if (surfacePointers.size < 2) pinchStartDistance = 0;
    };
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);
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
      if (entity != null) surface.openAt(event.clientX, event.clientY, entity);
    }
  });

  world.addEventListener("pointercancel", event => starts.delete(event.pointerId));
}
