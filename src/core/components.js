export function createCoreComponents(world) {
  return {
    // Semantic/world-space authority. Rendering consumes this; it does not own it.
    Transform: world.component("Transform"),

    // Disposable Three.js representation for ordinary world entities.
    RenderObject: world.component("RenderObject"),

    // A camera is an ordinary entity with projection data, not a renderer singleton.
    Camera: world.component("Camera"),

    // Optional semantic relationship. Systems resolve orientation from this relationship.
    CameraTarget: world.component("CameraTarget"),

    // Presentation allocation is separate from camera identity and world state.
    Viewport: world.component("Viewport"),

    // Marker component: which camera currently feeds the primary viewport.
    ActiveCamera: world.component("ActiveCamera"),

    // Disposable Three.js camera realization.
    CameraView: world.component("CameraView")
  };
}
