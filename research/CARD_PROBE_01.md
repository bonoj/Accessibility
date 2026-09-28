# Card Probe 01 — Adaptive Entity Surface

**Status:** preserved executable evidence  
**Date:** 2026-09-28  
**Specimen:** `src/probes/adaptive-entity-surface.js`

## Probe

A sparse Three.js scene began with a ball on a plane. Selecting the ball summons an ordinary DOM surface associated with the same semantic entity. A deliberately boring cube was then added to test whether the mechanism generalized without bespoke cube UI.

The surfaces can remain contextual, move through several experimental placements, expand to the viewport, reflow at large text sizes, scroll when necessary, collapse, and dismiss while the Three.js world continues underneath.

The preserved specimen supplies initial surface definition and state. The host supplies the ECS, Three.js realization, input routing, and DOM surface system.

## Evidence earned

The surface became useful when treated less like a fixed card and more like a small adaptive web page.

The same semantic capability can tolerate substantially different presentation states without requiring the spatial world to become the reading surface. A contextual surface can claim the whole viewport when useful and later reveal the still-running world.

Coarse explicit controls for text quantity, font size, expansion, collapse, and dismissal can coexist with pinch enlargement. Pinch is therefore an accelerator rather than the only route to enlarged text.

Several interaction failures were informative:

- dismissing on an imprecise outside touch made a missed gesture destructive;
- preserving transient pinch magnification across collapse or dismissal made the next encounter jarringly inherit old presentation state;
- realizing interactive DOM during the pointer release that selected an entity allowed the opening gesture to click through into newly appeared controls;
- showing a floating surface before its measured placement settled exposed a small visible positioning jiggle.

The resulting machinery uses deliberate dismissal, resets transient pinch magnification when collapsing or dismissing, lets the selecting gesture finish before realizing interactive DOM, and hides placement measurement until the surface has settled.

## Architecture earned

Entities own `Surface` and `SurfaceState` ECS data. Meaningful surface state does not belong to DOM realization.

The DOM is disposable presentation machinery in the same broad sense that a Three.js object is presentation machinery for spatial state.

The arbitrary-entity test succeeded: Ball and Cube use the same surface machinery while retaining independent semantic state. The simultaneous-realization test also succeeded: both surfaces can remain open, be changed, collapsed, dismissed, and reopened independently. Interaction raises the touched surface when overlap requires ordering, but z-order carries no semantic priority.

The realization is template-driven rather than a set of entity-specific DOM IDs and handlers. Adding the cube did not require a cube-specific surface implementation.

The specimen remains evidence, not a universal surface specification. These results do not establish that every entity needs a DOM surface, that surfaces should always coexist, or that the apparatus should grow desktop/window-management machinery.

## Experiential regression

The human collaborator exercised the Ball and Cube surfaces through the deployed candidates and reported both executions flawless once the click-through and placement-settling repairs landed. This is experiential evidence rather than exhaustive automated validation.

## Boundary reached

The original open edge—whether surface realization could become an ordinary capability of arbitrary entities without becoming bespoke application UI—has been answered sufficiently for this probe.

Further surface architecture should now be pulled by construction pressure rather than extended speculatively. The next useful evidence should come from putting meaningful things into the sparse world and noticing which capabilities become necessary.
