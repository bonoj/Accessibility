export function createCoreComponents(world) {
  return {
    // Semantic/world-space authority. Rendering consumes this; it does not own it.
    Transform: world.component("Transform"),

    // Disposable Three.js representation.
    RenderObject: world.component("RenderObject")
  };
}
