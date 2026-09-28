import { installOrbitInput } from "../runtime/orbit-input.js";

export function installInspection({ app, root }) {
  const world = root.querySelector("#world");
  installOrbitInput({
    element: world,
    activeCamera: () => app.systems.cameras.activeId(),
    orbit: app.systems.orbit,
    render: app.render
  });
}
