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
    Surface: world.component("Surface"),
    SurfaceState: world.component("SurfaceState"),
    Producer: world.component("Producer"),
    Inventory: world.component("Inventory"),
    Collectible: world.component("Collectible"),

    // Optional behavior data. Cameras without it remain ordinary static camera entities.
    OrbitBehavior: world.component("OrbitBehavior")
  };
}
