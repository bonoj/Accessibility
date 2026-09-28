function pretty(value) {
  return JSON.stringify(value, null, 2);
}

export function installInspection({ app, root }) {
  const cameraSelect = root.querySelector("#camera-select");
  const allocation = root.querySelector("#allocation");
  const state = root.querySelector("#camera-state");
  const refresh = root.querySelector("#refresh-state");

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

  refresh.addEventListener("click", showState);
  showState();
}
