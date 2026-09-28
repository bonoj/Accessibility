// Builds are observations of source; publication is separate.
import { installDiagnostics } from "./runtime/diagnostics.js";
import { createApp } from "./app/create-app.js";
import { installInspection } from "./app/inspection.js";

const diagnostics = installDiagnostics(document.querySelector("#diagnostics"));
const build = globalThis.__ACCESSIBILITY_BUILD__ || "local";
const buildId = document.querySelector("#build-id");
if (buildId) buildId.textContent = `build ${build.slice(0, 7)}`;
document.querySelector("#debug-refresh")?.addEventListener("click", () => location.reload());

try {
  const worldMount = document.querySelector("#world");
  if (!worldMount) throw new Error("Missing #world mount.");
  const app = createApp({ worldMount, diagnostics });
  globalThis.accessibility = app;
  installInspection({ app, root: document.querySelector("#app") });
  diagnostics.ready();
} catch (error) {
  diagnostics.fail("startup", error);
}
