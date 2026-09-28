// Builds are observations of source; publication is separate.
import { installDiagnostics } from "./runtime/diagnostics.js";
import { createApp } from "./app/create-app.js";
import { installInspection } from "./app/inspection.js";

const diagnostics = installDiagnostics(document.querySelector("#diagnostics"));

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
