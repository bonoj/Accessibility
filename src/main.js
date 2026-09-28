const app = document.querySelector("#app");
const diagnostics = document.querySelector("#diagnostics");

function showFailure(error) {
  diagnostics.hidden = false;
  diagnostics.textContent = `Startup failure: ${error?.stack || error}`;
}

try {
  app.innerHTML = `
    <section class="surface">
      <p class="eyebrow">ACCESSIBILITY</p>
      <h1>Construction starts here.</h1>
      <p>This is the executable surface. It is intentionally almost empty.</p>
      <p class="build">build ${globalThis.__ACCESSIBILITY_BUILD__}</p>
    </section>
  `;
} catch (error) {
  showFailure(error);
  throw error;
}

globalThis.addEventListener("error", event => showFailure(event.error || event.message));
globalThis.addEventListener("unhandledrejection", event => showFailure(event.reason));
