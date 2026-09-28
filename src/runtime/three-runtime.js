import * as THREE from "three";

export function createThreeRuntime({ mount, diagnostics }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f0eb);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.03, 1000);
  camera.position.set(0, 2.4, 5.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-label", "Construction world");
  mount.append(renderer.domElement);

  renderer.domElement.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    diagnostics.fail("WebGL context lost", "Reload to reconstruct the world.");
  });

  renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
    diagnostics.fail(
      "shader",
      [
        gl.getProgramInfoLog(program),
        gl.getShaderInfoLog(vertexShader),
        gl.getShaderInfoLog(fragmentShader)
      ].filter(Boolean).join("\n")
    );
  };

  function resize() {
    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(mount);
  resize();

  return {
    THREE,
    scene,
    camera,
    renderer,
    render: () => renderer.render(scene, camera),
    dispose() {
      observer.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
