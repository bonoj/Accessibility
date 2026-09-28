export function createCoreComponents(world) {
  return {
    Transform: world.component("Transform"),
    RenderObject: world.component("RenderObject"),
    Camera: world.component("Camera"),
    CameraTarget: world.component("CameraTarget"),
    Viewport: world.component("Viewport"),
    ActiveCamera: world.component("ActiveCamera"),
    CameraView: world.component("CameraView"),
    Light: world.component("Light"),
    LightView: world.component("LightView"),

    // Optional behavior data. Cameras without it remain ordinary static camera entities.
    OrbitBehavior: world.component("OrbitBehavior")
  };
}
