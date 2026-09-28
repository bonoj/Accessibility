export function createSurfaceSystem({ components, entity, root = document }) {
  const definition = components.Surface.get(entity);
  const state = components.SurfaceState.get(entity);
  if (!definition || !state) throw new Error("SurfaceSystem requires Surface and SurfaceState.");

  const card = root.querySelector("#entity-card");
  const body = root.querySelector("#surface-body");
  const title = root.querySelector("#entity-title");
  const kicker = root.querySelector(".surface-kicker");
  const description = root.querySelector("#entity-description");
  const quantity = root.querySelector("#text-quantity");
  const fontSize = root.querySelector("#font-size");
  const slider = root.querySelector("#amount-slider");
  const amountValue = root.querySelector("#amount-value");
  const status = root.querySelector("#action-status");
  const expand = root.querySelector("#surface-expand");
  const collapse = root.querySelector("#surface-collapse");
  const variant = root.querySelector("#surface-variant");
  const required = [card, body, title, kicker, description, quantity, fontSize, slider, amountValue, status, expand, collapse, variant];
  if (required.some(node => !node)) throw new Error("SurfaceSystem DOM realization is incomplete.");

  function place() {
    if (!state.open || state.expanded || state.variant !== "float") return;
    card.style.transform = "";
    const margin = 12;
    const rect = card.getBoundingClientRect();
    card.style.left = Math.max(margin, Math.min(innerWidth - rect.width - margin, state.anchor.x + 18)) + "px";
    card.style.top = Math.max(margin, Math.min(innerHeight - rect.height - margin, state.anchor.y - rect.height / 2)) + "px";
  }

  function sync() {
    card.hidden = !state.open;
    title.textContent = definition.title;
    kicker.textContent = definition.kicker;
    description.textContent = definition.copy[state.textQuantity] || definition.copy.short;
    quantity.value = state.textQuantity;
    fontSize.value = state.fontSize;
    slider.value = String(state.amount);
    amountValue.value = String(state.amount);
    status.value = state.actionStatus;
    variant.value = state.variant;
    card.dataset.variant = state.variant;
    card.dataset.size = state.fontSize;
    card.dataset.expanded = String(state.expanded);
    card.style.setProperty("--pinch-scale", String(state.pinchScale));
    body.hidden = state.collapsed;
    collapse.setAttribute("aria-expanded", String(!state.collapsed));
    collapse.textContent = state.collapsed ? "Expand content" : "Collapse";
    expand.setAttribute("aria-pressed", String(state.expanded));
    expand.textContent = state.expanded ? "Shrink" : "Expand";
    if (state.open) requestAnimationFrame(place);
  }

  function openAt(x, y) {
    state.open = true;
    state.anchor = { x, y };
    sync();
  }

  function dismiss() {
    state.open = false;
    state.pinchScale = 1;
    sync();
  }

  function toggleCollapsed() {
    state.collapsed = !state.collapsed;
    if (state.collapsed) state.pinchScale = 1;
    sync();
  }

  function toggleExpanded() {
    state.expanded = !state.expanded;
    sync();
  }

  function patch(values) {
    Object.assign(state, values);
    sync();
  }

  sync();
  addEventListener("resize", place);
  return { definition, state, sync, place, openAt, dismiss, toggleCollapsed, toggleExpanded, patch };
}
