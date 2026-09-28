// Small semantic event seam. Producers do not need to know which system consumes an event.
// This is intentionally not a command framework; it is enough to keep modalities from coupling
// directly to world behavior as experiments begin.
export function createEventBus() {
  const listeners = new Map();

  function on(type, listener) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(listener);
    return () => listeners.get(type)?.delete(listener);
  }

  function emit(type, detail = {}) {
    const event = Object.freeze({ type, detail });
    for (const listener of listeners.get(type) ?? []) listener(event);
    for (const listener of listeners.get("*") ?? []) listener(event);
    return event;
  }

  return { on, emit };
}
