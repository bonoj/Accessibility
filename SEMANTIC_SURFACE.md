# Semantic Surface

**Status:** provisional present-tense authority  
**Project:** Accessibility

This file is intentionally small. It records only what currently deserves to constrain future work.

## Purpose

Accessibility investigates model-mediated construction environments that reduce barriers between intention and executable creation without unnecessarily reducing expressive power.

The project is for people, not a predefined user category.

## Current commitments

### Low floor without a low ceiling

Ease of entry must not require permanently simplifying what can ultimately be constructed.

Complexity may emerge in the thing being built without requiring equivalent complexity in the interface used to build it.

### Accessibility is the substrate

Accessibility is not synonymous with voice control, large text, disability accommodation, novice mode, or any other single feature.

Individual mechanisms may be important, but the project investigates the accessibility of the construction relationship as a whole.

### Multiple forms of reference should remain possible

The apparatus should not unnecessarily require one precise physical or linguistic way to refer to something.

Where the experiment permits it, the same meaningful entity may eventually be recoverable through different forms of reference: language, coarse spatial description, selection, history, or other mechanisms earned through use.

This is a direction for investigation, not yet a completed reference architecture.

### Text must tolerate extreme enlargement

Important textual interaction must be able to become extraordinarily large without removing access to the underlying construction capability.

Do not make essential understanding depend on small text remaining spatially attached to a 3D world.

When a Three.js or similar spatial runtime is used, language and detailed reading surfaces should remain separable enough that accessible reflow and extreme enlargement are possible.

### Precision is not a prerequisite for expressive power

Do not make fine motor precision, dense visual targeting, hidden gestures, or similarly fragile interaction a necessary gateway to sophisticated construction unless executable evidence demonstrates that a particular operation truly requires it.

### Incomplete ideas are legitimate starting material

A person should not need a complete specification, correct ontology, programming vocabulary, or implementation plan before beginning to construct.

The environment may help incomplete ideas become concrete through interaction and evidence.

### Multimodality is the working response to accessibility breadth

Accessibility pressure appears across many domains: perception, motor interaction, language, legibility, attention, technical vocabulary, and others we have not yet encountered.

Do not respond by constructing a separate accommodation tree for every domain. That approach multiplies every capability by every accessibility concern and risks fragmenting both the interface and the world.

The current working direction is to keep intention and world state semantic while allowing interaction and presentation to be multimodal. Different forms of expression should be able to converge on shared semantic events and identities; different forms of presentation should be able to expose the same underlying world facts.

This is a core decomposition, not a claim that every modality is interchangeable or that one universal interface exists.

### ECS is currently chosen as separation machinery

The first executable work will use an entity-component-system style architecture because it offers a concrete way to keep semantic state, event handling, construction behavior, input interpretation, and presentation concerns separable without requiring each entity to understand every modality.

Here ECS means primarily **data-driven state and event handling**, not allegiance to a game-engine pattern.

A construction system should not need to know whether an entity was referenced by speech, a coarse tap, text, an image-mediated reference, or another channel if those interactions can resolve to the same semantic event. Likewise, a semantic fact should not need to fork merely because it can be represented spatially, as very large reflowable text, through speech, or through another presentation system.

ECS is therefore an implementation hypothesis chosen for the accessibility problem we currently see: many independently changing interaction and presentation concerns acting on one coherent semantic world.

Its usefulness must still be tested through executable evidence. If it fails to preserve that separation or creates greater barriers than it removes, the architecture may change.

### Executable evidence earns architecture

Do not prematurely decide that the correct apparatus is Foundry, a node graph, a canvas, a conversational agent, a voice interface, or any other favored mechanism merely because it is familiar.

ECS has now been selected for the first implementation because it directly addresses an observed separation problem, but that selection remains falsifiable.

Build bounded probes. Observe use. Promote mechanisms and vocabulary when they prove useful.

## Authority boundaries

- `SEMANTIC_SURFACE.md` records current earned constraints.
- `research/` preserves hypotheses and observations without making them requirements.
- `changes/` will preserve bounded implementation expeditions and actual outcomes.
- implementation will own realization details once implementation exists.
- Git preserves exact lineage.

A research note does not become authority through age or repetition.

## Non-commitments

There is currently no commitment to:

- Three.js or any rendering engine;
- voice as the primary interface;
- touch as the primary interface;
- a desktop, phone, headset, or other device class;
- a node editor;
- Foundry's implementation or entity vocabulary;
- a specific model provider;
- a backend;
- continuous model inference;
- a particular persistence mechanism;
- a particular disability, age group, skill level, or profession;
- a fixed accessibility profile;
- a simplified feature set;
- one universal interaction mode.

## Present finish line

The repository is ready for its first executable expedition when we can state a small accessibility uncertainty that an extremely small construction apparatus could actually test.

Preserving negative space is preferable to filling the repository with speculative interface machinery.
