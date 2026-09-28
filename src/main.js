// Builds are observations of source; publication is separate.
import { installDiagnostics } from "./runtime/diagnostics.js";
import { createApp } from "./app/create-app.js";

const diagnosticsElement = document.querySelector("#diagnostics");
const diagnostics = installDiagnostics(diagnosticsElement);

try {
  const worldMount = document.querySelector("#world");
  if (!worldMount) throw new Error("Missing #world mount.");

  const app = createApp({ worldMount, diagnostics });
  globalThis.accessibility = app;
  diagnostics.ready();
} catch (error) {
  diagnostics.fail("startup", error);
  throw error;
}
