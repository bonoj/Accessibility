export function installOrbitInput({ element, activeCamera, orbit, render, onChange }) {
  const pointers = new Map();
  let pinchDistance = null;

  function notify() { render(); onChange?.(); }
  function orbitBy(dx, dy) {
    const id = activeCamera();
    if (id != null && orbit.adjust(id, { azimuth: -dx * 0.008, polar: dy * 0.008 })) notify();
  }
  function zoomBy(delta) {
    const id = activeCamera();
    if (id != null && orbit.adjust(id, { distance: delta })) notify();
  }

  element.addEventListener("pointerdown", event => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  });

  element.addEventListener("pointermove", event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);

    if (pointers.size === 1) {
      const dx = next.x - previous.x;
      const dy = next.y - previous.y;
      // Native vertical page/browser gestures win. A clearly horizontal gesture is spatial intent.
      if (Math.abs(dx) > Math.abs(dy) * 1.15) orbitBy(dx, 0);
      return;
    }

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDistance != null) zoomBy((pinchDistance - distance) * 0.015);
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
    if (!(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    zoomBy(event.deltaY * 0.006);
  }, { passive: false });
}
