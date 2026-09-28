import { installOrbitInput } from "../runtime/orbit-input.js";

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

export function installInspection({ app, root }) {
  const cameraSelect = root.querySelector("#camera-select");
  const allocation = root.querySelector("#allocation");
  const state = root.querySelector("#camera-state");
  const refresh = root.querySelector("#refresh-state");
  const world = root.querySelector("#world");

  for (const camera of app.systems.cameras.inspect()) {
    const option = document.createElement("option");
    option.value = String(camera.id);
    option.textContent = `${camera.name} — entity ${camera.id}`;
    option.selected = camera.active;
    cameraSelect.append(option);
  }

  function showState() {
    state.textContent = pretty(app.inspect());
  }

  function changeOrbit(delta) {
    const id = app.systems.cameras.activeId();
    if (id == null) return;
    app.systems.orbit.adjust(id, delta);
    app.render();
    showState();
  }

  cameraSelect.addEventListener("change", () => {
    app.systems.cameras.setActive(Number(cameraSelect.value));
    app.render();
    showState();
  });

  allocation.addEventListener("change", () => {
    root.dataset.allocation = allocation.value;
    requestAnimationFrame(() => {
      app.render();
      showState();
    });
  });

  root.querySelectorAll("[data-orbit]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.orbit;
      if (action === "left") changeOrbit({ azimuth: -Math.PI / 12 });
      if (action === "right") changeOrbit({ azimuth: Math.PI / 12 });
      if (action === "up") changeOrbit({ polar: -Math.PI / 18 });
      if (action === "down") changeOrbit({ polar: Math.PI / 18 });
      if (action === "near") changeOrbit({ distance: -0.5 });
      if (action === "far") changeOrbit({ distance: 0.5 });
    });
  });

  installOrbitInput({
    element: world,
    activeCamera: () => app.systems.cameras.activeId(),
    orbit: app.systems.orbit,
    render: app.render,
    onChange: showState
  });

  refresh.addEventListener("click", showState);
  showState();
}
