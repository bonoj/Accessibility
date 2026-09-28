# Card Probe 01 — Adaptive Entity Surface

**Status:** preserved executable evidence  
**Date:** 2026-09-28  
**Specimen:** `src/probes/adaptive-entity-surface.js`

## Probe

A sparse Three.js scene contains a single ball on a plane. Selecting the ball summons an ordinary DOM surface associated with the same semantic entity.

The surface can remain contextual, move through several experimental placements, expand to the viewport, reflow at large text sizes, scroll when necessary, collapse, and dismiss while the Three.js world continues underneath.

The preserved specimen supplies the ball's surface definition and initial state. The host supplies the ECS, Three.js realization, input routing, and DOM surface system.

## Evidence earned

The surface became useful when treated less like a fixed card and more like a small adaptive web page.

The same semantic capability can tolerate substantially different presentation states without requiring the spatial world to become the reading surface. A contextual surface can claim the whole viewport when useful and later reveal the still-running world.

Coarse explicit controls for text quantity, font size, expansion, collapse, and dismissal can coexist with pinch enlargement. Pinch is therefore an accelerator rather than the only route to enlarged text.

Two failures were especially informative:

- dismissing on an imprecise outside touch made a missed gesture destructive;
- preserving transient pinch magnification across collapse or dismissal made the next encounter jarringly inherit old presentation state.

The current probe therefore uses deliberate dismissal and resets transient pinch magnification when collapsing or dismissing.

## Architecture earned

The ball owns `Surface` and `SurfaceState` ECS data. Meaningful surface state does not belong to the DOM realization.

The DOM is disposable presentation machinery in the same broad sense that a Three.js object is presentation machinery for spatial state. This probe does not establish that every entity needs a permanently realized DOM tree or that only one surface may ever be visible.

The specimen is evidence, not a universal surface specification. Future probes may use the same substrate without inheriting this ball, copy, controls, layout, or interaction choices.

## Initial regression

After the ECS migration, the preview at the `...9d5` cut was briefly inspected by the human collaborator and reported to look good. Treat this as an initial experiential regression check, not exhaustive validation.

## Open edge

The current SurfaceSystem is still instantiated for the witness ball. The next architectural test is whether surface realization can become an ordinary capability of arbitrary entities without turning the system into a bespoke application UI.
