const STARTUP_TIMEOUT_MS = 30_000;

export function installDiagnostics(element) {
  let ready = false;

  const show = (scope, error) => {
    const message = error?.stack || error?.message || String(error);
    element.hidden = false;
    element.textContent = `ACCESSIBILITY — ${scope}\n${message}`;
  };

  const onError = event => show("startup / runtime", event.error || event.message);
  const onRejection = event => show("promise", event.reason);

  globalThis.addEventListener("error", onError);
  globalThis.addEventListener("unhandledrejection", onRejection);

  const watchdog = globalThis.setTimeout(() => {
    if (!ready) show("load watchdog", "Startup exceeded 30 seconds. Check WebGL support.");
  }, STARTUP_TIMEOUT_MS);

  return {
    fail: show,
    ready() {
      ready = true;
      globalThis.clearTimeout(watchdog);
    }
  };
}
