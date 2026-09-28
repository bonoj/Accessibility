export function createSurfaceSystem({ components, entity, root = document }) {
  let activeEntity = entity;
  let zCounter = 800;
  const realizations = new Map();
  const template = root.querySelector("#entity-surface-template");
  const variant = root.querySelector("#surface-variant");
  if (!template) throw new Error("SurfaceSystem template is missing.");

  function resolve(entityId = activeEntity) {
    const definition = components.Surface.get(entityId);
    const state = components.SurfaceState.get(entityId);
    if (!definition || !state) throw new Error("SurfaceSystem requires Surface and SurfaceState.");
    return { definition, state };
  }

  function nodes(card) {
    const get = role => card.querySelector(`[data-surface-role="${role}"]`);
    const result = {
      card,
      body: get("body"),
      title: get("title"),
      kicker: card.querySelector(".surface-kicker"),
      description: get("description"),
      quantity: get("quantity"),
      fontSize: get("font-size"),
      slider: get("slider"),
      amountValue: get("amount-value"),
      status: get("status"),
      expand: get("expand"),
      collapse: get("collapse"),
      dismiss: get("dismiss"),
      action: get("action")
    };
    if (Object.values(result).some(node => !node)) throw new Error("SurfaceSystem DOM realization is incomplete.");
    return result;
  }

  function raise(entityId) {
    const realization = realizations.get(entityId);
    if (!realization) return;
    activeEntity = entityId;
    realization.card.style.zIndex = String(++zCounter);
    const { state } = resolve(entityId);
    if (variant) variant.value = state.variant;
  }

  function place(entityId) {
    const realization = realizations.get(entityId);
    if (!realization) return;
    const { card } = realization;
    const { state } = resolve(entityId);
    if (!state.open || state.expanded || state.variant !== "float") return;
    card.style.transform = "";
    const margin = 12;
    const rect = card.getBoundingClientRect();
    card.style.left = Math.max(margin, Math.min(innerWidth - rect.width - margin, state.anchor.x + 18)) + "px";
    card.style.top = Math.max(margin, Math.min(innerHeight - rect.height - margin, state.anchor.y - rect.height / 2)) + "px";
  }

  function sync(entityId = activeEntity, { settling = false } = {}) {
    const { definition, state } = resolve(entityId);
    let realization = realizations.get(entityId);
    if (!realization && !state.open) return;
    if (!realization) realization = realize(entityId);
    const n = realization;
    n.card.hidden = !state.open;
    n.card.dataset.settling = String(settling && state.open);
    n.title.textContent = definition.title;
    n.kicker.textContent = definition.kicker;
    n.description.textContent = definition.copy[state.textQuantity] || definition.copy.short;
    n.quantity.value = state.textQuantity;
    n.fontSize.value = state.fontSize;
    n.slider.value = String(state.amount);
    n.amountValue.value = String(state.amount);
    n.status.value = state.actionStatus;
    n.card.dataset.variant = state.variant;
    n.card.dataset.size = state.fontSize;
    n.card.dataset.expanded = String(state.expanded);
    n.card.style.setProperty("--pinch-scale", String(state.pinchScale));
    n.body.hidden = state.collapsed;
    n.collapse.setAttribute("aria-expanded", String(!state.collapsed));
    n.collapse.textContent = state.collapsed ? "Expand content" : "Collapse";
    n.expand.setAttribute("aria-pressed", String(state.expanded));
    n.expand.textContent = state.expanded ? "Shrink" : "Expand";
    if (entityId === activeEntity && variant) variant.value = state.variant;
    if (state.open) {
      requestAnimationFrame(() => {
        place(entityId);
        n.card.dataset.settling = "false";
      });
    }
  }

  function patchEntity(entityId, values) {
    const { state } = resolve(entityId);
    Object.assign(state, values);
    sync(entityId);
  }

  function realize(entityId) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".entity-card");
    if (!card) throw new Error("SurfaceSystem template has no entity card.");
    const n = nodes(card);
    const titleId = `entity-title-${entityId}`;
    n.title.id = titleId;
    card.setAttribute("aria-labelledby", titleId);
    card.dataset.entity = String(entityId);
    root.body.appendChild(fragment);
    realizations.set(entityId, n);

    let pinchStartDistance = 0;
    let pinchStartScale = 1;
    const pointers = new Map();

    card.addEventListener("pointerdown", event => {
      raise(entityId);
      if (event.pointerType !== "touch") return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStartDistance = Math.hypot(a.x - b.x, a.y - b.y);
        pinchStartScale = resolve(entityId).state.pinchScale;
      }
    });
    card.addEventListener("pointermove", event => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size !== 2 || pinchStartDistance <= 0) return;
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      patchEntity(entityId, { pinchScale: Math.max(0.8, Math.min(3, pinchStartScale * distance / pinchStartDistance)) });
    });
    const release = event => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchStartDistance = 0;
    };
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);

    n.quantity.addEventListener("change", () => patchEntity(entityId, { textQuantity: n.quantity.value }));
    n.fontSize.addEventListener("change", () => patchEntity(entityId, { fontSize: n.fontSize.value }));
    n.slider.addEventListener("input", () => patchEntity(entityId, { amount: Number(n.slider.value) }));
    n.action.addEventListener("click", () => {
      const name = resolve(entityId).definition.title.toLowerCase();
      patchEntity(entityId, { actionStatus: `The ${name} noticed. The control works.` });
    });
    n.expand.addEventListener("click", () => toggleExpanded(entityId));
    n.collapse.addEventListener("click", () => toggleCollapsed(entityId));
    n.dismiss.addEventListener("click", () => dismiss(entityId));
    return n;
  }

  function openAt(x, y, entityId = activeEntity) {
    const { state } = resolve(entityId);
    activeEntity = entityId;
    state.open = true;
    state.anchor = { x, y };
    if (!realizations.has(entityId)) realize(entityId);
    raise(entityId);
    sync(entityId, { settling: true });
  }

  function dismiss(entityId = activeEntity) {
    const { state } = resolve(entityId);
    state.open = false;
    state.pinchScale = 1;
    sync(entityId);
  }

  function toggleCollapsed(entityId = activeEntity) {
    const { state } = resolve(entityId);
    state.collapsed = !state.collapsed;
    if (state.collapsed) state.pinchScale = 1;
    sync(entityId);
  }

  function toggleExpanded(entityId = activeEntity) {
    const { state } = resolve(entityId);
    state.expanded = !state.expanded;
    sync(entityId);
  }

  function patch(values, entityId = activeEntity) {
    patchEntity(entityId, values);
  }

  if (variant) {
    variant.addEventListener("change", () => patchEntity(activeEntity, { variant: variant.value }));
  }
  addEventListener("resize", () => {
    for (const entityId of realizations.keys()) place(entityId);
  });

  return {
    get entity() { return activeEntity; },
    get definition() { return resolve(activeEntity).definition; },
    get state() { return resolve(activeEntity).state; },
    sync, place, openAt, dismiss, toggleCollapsed, toggleExpanded, patch, raise
  };
}
