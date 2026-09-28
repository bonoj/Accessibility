# Semantic ECS Construction Probe

**Status:** research evidence, non-authoritative  
**Probe:** Ball → Jupurn and ring-matter theft

## Why this probe happened

The apparatus had already earned a tiny ECS, shared presentation machinery, frame-owned rendering, and source-to-candidate deployment. The next question was whether that sparse substrate could carry a large semantic jump without first growing an editor or a general systems framework.

The initiating construction request was intentionally ordinary domain language: turn the Ball into a Saturn-like object whose rings are roughly a thousand ball bearings, clear some bands, and give it moons in 4:2:1 orbital resonance. Subsequent conversational corrections asked for broad moving rings, a small ring-interacting moon, removal of the old loose-ball production behavior, and a Cube that steals nearby ring matter one particle at a time.

The resulting object became informally known as **Jupurn**. It is not intended to simulate Saturn.

## What was implemented

The original witness ECS identity survived while its Three realization became a group containing an oblate planet, a dense instanced ring field, three resonant moons, and a smaller ring-interacting moon.

The three outer moons are ECS entities carrying orbital behavior. Their angular rates encode the requested 4:2:1 relation as data.

The ring field owns 1,600 subordinate particles. They are not 1,600 ECS entities. Each particle retains compact orbital, radial, vertical, disturbance, presence, claim, and pull state inside the ring-field system.

The ring field uses broad radial distributions with explicit empty lanes rather than narrow tracks. Independent deterministic particle sampling removed an early correlated angular seam. Slow differential circulation and small independent radial/vertical oscillations keep the field from reading as rigid geometry.

A small moon perturbs nearby ring particles. Disturbance decays after passage, so a moving local depletion can heal behind it without using a rotating transparency mask.

The Cube has unbounded semantic inventory. It acquires one ring particle at a time, choosing the nearest currently realized unclaimed particle inside its acquisition range. The claimed particle continues to receive its natural ring and perturbation state while collector attraction increasingly biases its realized position toward Cube. Capture removes that particle from the finite ring population, increments inventory, and frees Cube to acquire the next nearest particle.

## Evidence worth preserving

### Domain language produced a substantial executable change

The human request did not specify components, classes, instancing strategy, scheduler changes, transform math, or system interfaces. Those implementation decisions could remain model-side while the human shaped the semantic and perceptual result through ordinary descriptions and executable observation.

This is evidence for the working idea that ECS can function as a hidden implementation language beneath a much less technical authoring language. It is not evidence that ECS is universally optimal for model-mediated construction.

### Semantic actors and dense simulation matter need different granularity

Making every bearing an ECS entity was unnecessary for this probe. The semantically consequential actors benefit from explicit ECS identity; the dense ring population benefits from compact domain-owned storage.

The useful question is therefore not "is everything an entity?" but "what needs independent semantic identity, composition, reference, or durable state?"

### Systems can compete without replacing one another

The theft interaction became more useful when collection stopped being a radius-triggered disappearance. A claimed particle remains ring matter while being stolen: orbital motion and perturbation establish its natural state, then collection adds another influence.

This keeps the interaction inspectable and lets executable behavior reveal whether arbitration, priorities, forces, or richer scheduling are eventually needed. None of those generic mechanisms should be prebuilt from this one example.

### Render hierarchy is not semantic hierarchy

Jupurn's Three realization is a parent group containing meshes and instanced matter. An initial raycast only tested the parent object and made Jupurn effectively untappable. Recursive raycasting repaired the concrete interaction, but the semantic rule is narrower than "all children are independently selectable."

At present, Jupurn dominates its realization. A hit on its subordinate visual parts resolves to Jupurn. The moons should become independent tap targets only if the world later earns them as independently addressable semantic things.

ECS identity alone does not confer user-facing identity.

### Coordinate spaces are part of system composition

Cube exists in world space while ring particles are simulated in Jupurn-local space. The first collector conversion called `worldToLocal()` before frame synchronization had projected Jupurn's semantic +Y Transform onto its Three group. The tilt was inverted but the translation was absent, so stolen particles visibly flowed toward the wrong vertical target.

The repair explicitly composed the semantic transform and updated the world matrix before converting Cube into ring-local coordinates.

The lesson is not to duplicate Transform state casually. When systems cross representation or coordinate boundaries, verify which authority has been synchronized at that point in the frame.

### Small cuts kept the probe recoverable

Orbital behavior, ring-field behavior, ECS component integration, selection repair, collection claims, vacuum tuning, and transform repair landed as separate commits. Each produced a bounded inspectable state.

This made visual corrections cheap and kept a surprisingly large semantic transformation from becoming one fragile implementation turn.

## What this probe does not establish

It does not establish a universal physics model, generic force system, general ownership hierarchy, universal child selection rule, ECS-per-particle architecture, scheduler dependency graph, or reusable editor vocabulary.

It does establish that the current tiny semantic ECS plus repository/build machinery can carry substantially more construction pressure than the initial Ball/Cube apparatus demonstrated.

The next useful pressure should come from constructing another world or system, not from expanding the framework merely because expansion is possible.
