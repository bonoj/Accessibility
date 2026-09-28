// Preserved executable specimen: the first adaptive entity-surface probe.
// The host supplies ECS + Three.js; this module supplies the probe's semantic entity data.
export const adaptiveEntitySurfaceProbe = {
  id: "adaptive-entity-surface-01",
  title: "Adaptive Entity Surface",
  witness: {
    surface: {
      title: "Ball",
      kicker: "Scene entity",
      copy: {
        short: "A simple object in the scene.",
        medium: "A simple object in the scene. It has a stable identity even when the way you inspect or operate it changes. This surface is temporary tooling attached to that same underlying thing.",
        lots: "A simple object in the scene. It has a stable identity even when the way you inspect or operate it changes. This surface is temporary tooling attached to that same underlying thing. The extra text exists to put pressure on reading, reflow, scrolling, control discovery, and recovery rather than to explain the ball. As the amount of language grows, the surface is allowed to claim more room instead of forcing the world and the text to compete for the same pixels. If the text becomes very large, ordinary web layout should continue doing useful work. Controls should remain reachable, state should remain intact, and the Three.js world may continue running behind a surface that temporarily occupies the entire view. Dismissing or shrinking the surface should reveal the world without requiring the spatial scene to reconstruct itself."
      }
    },
    surfaceState: {
      open: false,
      collapsed: false,
      expanded: false,
      textQuantity: "short",
      fontSize: "normal",
      pinchScale: 1,
      variant: "float",
      amount: 50,
      actionStatus: "Nothing has happened yet.",
      anchor: { x: 0, y: 0 }
    }
  }
};
