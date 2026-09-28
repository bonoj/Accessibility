export function createCameraSystem({ world, components, three }) {
  const { Transform, Camera, CameraTarget, Viewport, ActiveCamera, CameraView } = components;

  function ensureView(id) {
    const spec = Camera.get(id);
    let view = CameraView.get(id)?.camera;

    if (!view) {
      if (spec.projection === "orthographic") {
        view = new three.THREE.OrthographicCamera(-1, 1, 1, -1, spec.near, spec.far);
      } else {
        view = new three.THREE.PerspectiveCamera(spec.fov, 1, spec.near, spec.far);
      }
      world.add(id, CameraView, { camera: view });
    }
    return view;
  }

  function syncProjection(id, camera, width, height) {
    const spec = Camera.get(id);
    const aspect = Math.max(1, width) / Math.max(1, height);

    if (camera.isPerspectiveCamera) {
      camera.fov = spec.fov;
      camera.near = spec.near;
      camera.far = spec.far;
      camera.aspect = aspect;
    } else {
      const halfHeight = spec.height / 2;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.near = spec.near;
      camera.far = spec.far;
    }
    camera.updateProjectionMatrix();
  }

  function syncPose(id, camera) {
    const transform = Transform.get(id);
    if (!transform) return;
    if (transform.position) camera.position.copy(transform.position);
    if (transform.quaternion) camera.quaternion.copy(transform.quaternion);
    else if (transform.rotation) camera.rotation.copy(transform.rotation);

    const relation = CameraTarget.get(id);
    if (relation?.entity != null) {
      const target = Transform.get(relation.entity);
      if (target?.position) camera.lookAt(target.position);
    }
  }

  function syncAll() {
    const { width, height } = three.size();
    for (const id of world.query(Camera, Transform)) {
      const camera = ensureView(id);
      syncProjection(id, camera, width, height);
      syncPose(id, camera);
    }
  }

  function activeId() {
    return world.query(Camera, ActiveCamera)[0] ?? world.query(Camera)[0] ?? null;
  }

  function setActive(id) {
    if (!Camera.has(id)) throw new Error(`entity ${id} is not a camera`);
    for (const other of world.query(ActiveCamera)) world.remove(other, ActiveCamera);
    world.add(id, ActiveCamera, true);
  }

  function render() {
    syncAll();
    const id = activeId();
    if (id == null) return;
    const view = CameraView.get(id)?.camera;
    if (!view) return;
    three.render(view);
  }

  function inspect() {
    return world.query(Camera, Transform).map(id => {
      const spec = Camera.get(id);
      const transform = Transform.get(id);
      const relation = CameraTarget.get(id);
      const viewport = Viewport.get(id);
      const view = CameraView.get(id)?.camera;
      return {
        id,
        name: spec.name,
        projection: spec.projection,
        active: ActiveCamera.has(id),
        position: transform.position ? transform.position.toArray().map(n => Number(n.toFixed(2))) : null,
        target: relation?.entity ?? null,
        viewport: viewport ?? null,
        realizedAs: view?.type ?? null
      };
    });
  }

  return { syncAll, render, setActive, activeId, inspect };
}
