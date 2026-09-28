export function installOrbitInput({ element, activeCamera, orbit, onChange }) {
  const pointers = new Map();
  let pinchDistance = null;

  function notify() { onChange?.(); }
  function orbitBy(dx, dy) {
    const id = activeCamera();
    if (id != null && orbit.adjust(id, { azimuth: -dx * 0.006, polar: -dy * 0.006 })) notify();
  }
  function zoomBy(delta) {
    const id = activeCamera();
    if (id != null && orbit.adjust(id, { distance: delta })) notify();
  }

  element.addEventListener("pointerdown", event => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    element.setPointerCapture?.(event.pointerId);
  });

  element.addEventListener("pointermove", event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);

    if (pointers.size === 1) {
      orbitBy(next.x - previous.x, next.y - previous.y);
      return;
    }

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDistance != null) {
        const id = activeCamera();
        const state = id == null ? null : orbit.inspect(id);
        if (state && distance > 0 && pinchDistance > 0) {
          const nextDistance = state.distance * (pinchDistance / distance);
          zoomBy(nextDistance - state.distance);
        }
      }
      pinchDistance = distance;
    }
  });

  function release(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchDistance = null;
  }
  element.addEventListener("pointerup", release);
  element.addEventListener("pointercancel", release);

  element.addEventListener("wheel", event => {
    event.preventDefault();
    const id = activeCamera();
    const state = id == null ? null : orbit.inspect(id);
    if (state) zoomBy(state.distance * (Math.exp(event.deltaY * 0.001) - 1));
  }, { passive: false });
}
