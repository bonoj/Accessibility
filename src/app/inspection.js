import { installOrbitInput } from "../runtime/orbit-input.js";

const COPY = {
  short: "A simple object in the scene.",
  medium: "A simple object in the scene. It has a stable identity even when the way you inspect or operate it changes. This surface is temporary tooling attached to that same underlying thing.",
  lots: "A simple object in the scene. It has a stable identity even when the way you inspect or operate it changes. This surface is temporary tooling attached to that same underlying thing. The extra text exists to put pressure on reading, reflow, scrolling, control discovery, and recovery rather than to explain the ball. As the amount of language grows, the surface is allowed to claim more room instead of forcing the world and the text to compete for the same pixels. If the text becomes very large, ordinary web layout should continue doing useful work. Controls should remain reachable, state should remain intact, and the Three.js world may continue running behind a surface that temporarily occupies the entire view. Dismissing or shrinking the surface should reveal the world without requiring the spatial scene to reconstruct itself."
};

export function installInspection({ app, root }) {
  const world = root.querySelector("#world");
  const card = document.querySelector("#entity-card");
  const body = document.querySelector("#surface-body");
  const description = document.querySelector("#entity-description");
  const quantity = document.querySelector("#text-quantity");
  const fontSize = document.querySelector("#font-size");
  const slider = document.querySelector("#amount-slider");
  const amountValue = document.querySelector("#amount-value");
  const action = document.querySelector("#ball-action");
  const status = document.querySelector("#action-status");
  const expand = document.querySelector("#surface-expand");
  const collapse = document.querySelector("#surface-collapse");
  const dismiss = document.querySelector("#surface-dismiss");
  const variant = document.querySelector("#surface-variant");
  const canvas = app.three.renderer.domElement;
  const raycaster = new app.three.THREE.Raycaster();
  const pointer = new app.three.THREE.Vector2();
  const starts = new Map();
  let anchor = { x: innerWidth / 2, y: innerHeight / 2 };

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

  function placeCard() {
    if (!card || card.hidden || card.dataset.expanded === "true") return;
    card.style.transform = "";
    if ((variant?.value || "float") !== "float") return;
    const margin = 12;
    const rect = card.getBoundingClientRect();
    card.style.left = Math.max(margin, Math.min(innerWidth - rect.width - margin, anchor.x + 18)) + "px";
    card.style.top = Math.max(margin, Math.min(innerHeight - rect.height - margin, anchor.y - rect.height / 2)) + "px";
  }

  function showCard(x, y) {
    if (!card) return;
    anchor = { x, y };
    card.hidden = false;
    requestAnimationFrame(placeCard);
  }

  function setExpanded(next) {
    if (!card) return;
    card.dataset.expanded = String(next);
    expand?.setAttribute("aria-pressed", String(next));
    if (expand) expand.textContent = next ? "Shrink" : "Expand";
    if (!next) requestAnimationFrame(placeCard);
  }

  quantity?.addEventListener("change", () => {
    if (description) description.textContent = COPY[quantity.value] || COPY.short;
    requestAnimationFrame(placeCard);
  });

  fontSize?.addEventListener("change", () => {
    if (card) card.dataset.size = fontSize.value;
    requestAnimationFrame(placeCard);
  });

  slider?.addEventListener("input", () => {
    if (amountValue) amountValue.value = slider.value;
  });

  action?.addEventListener("click", () => {
    if (status) status.value = "The ball noticed. The control works.";
  });

  expand?.addEventListener("click", () => setExpanded(card?.dataset.expanded !== "true"));

  collapse?.addEventListener("click", () => {
    if (!body) return;
    body.hidden = !body.hidden;
    collapse.setAttribute("aria-expanded", String(!body.hidden));
    collapse.textContent = body.hidden ? "Expand content" : "Collapse";
    requestAnimationFrame(placeCard);
  });

  dismiss?.addEventListener("click", () => {
    if (card) card.hidden = true;
  });

  variant?.addEventListener("change", () => {
    if (!card) return;
    card.dataset.variant = variant.value;
    requestAnimationFrame(placeCard);
  });

  if (card) {
    card.dataset.variant = variant?.value || "float";
    card.dataset.size = fontSize?.value || "normal";
    card.dataset.expanded = "false";
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
  addEventListener("resize", placeCard);
}
