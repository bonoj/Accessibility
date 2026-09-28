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

Accessibility is not synonymous with voice control, large text, disability accommodation, novice mode, 3D interaction, or any other single feature.

Individual mechanisms may be important, but the project investigates the accessibility of the construction relationship as a whole.

### Lower entry barriers without narrowing construction

The apparatus should reduce how much interface machinery, implementation ceremony, prerequisite vocabulary, and physical precision a person must personally operate before beginning useful executable inquiry.

That reduction must not be purchased by confining later work to a preauthored catalog of tools or outcomes.

The working target is an extensible construction substrate: make the first meaningful experiment inexpensive while preserving the ability for people, with model assistance where useful, to extend the apparatus toward tools the original system did not anticipate.

A capable model may carry implementation complexity that does not need to appear in the human interaction surface. This is part of the accessibility hypothesis, not a reason to hide consequential behavior or remove human judgment.

### 3D is a first-class capability, not a prerequisite

Navigable 3D worlds are an important capability under investigation and a useful stress test for interaction assumptions.

They are not the required construction medium.

No essential project capability should be defined as inherently spatial merely because the current apparatus uses Three.js. Spatial, textual, conversational, image-based, diagrammatic, or other representations may coexist when evidence earns them. A person should not have to master a 3D representation merely to reach another useful representation of the same work.

### Multiple forms of reference should remain possible

The apparatus should not unnecessarily require one precise physical or linguistic way to refer to something.

Where the experiment permits it, the same meaningful entity may eventually be recoverable through different forms of reference: language, coarse spatial description, selection, history, or other mechanisms earned through use.

This is a direction for investigation, not yet a completed reference architecture.

### Text must tolerate extreme enlargement

Important textual interaction must be able to become extraordinarily large without removing access to the underlying construction capability.

Do not make essential understanding depend on small text remaining spatially attached to a 3D world.

When a Three.js or similar spatial runtime is used, language and detailed reading surfaces should remain separable enough that accessible reflow and extreme enlargement are possible.

### Precision is not a prerequisite for expressive power

Do not make fine motor precision, dense visual targeting, hidden gestures, coordinated multi-touch gestures, or similarly fragile interaction a necessary gateway to sophisticated construction unless executable evidence demonstrates that a particular operation truly requires it.

Where possible, precision and simultaneity should improve efficiency rather than determine whether a capability is available at all. Accidental or imprecise input should be cheap to recover from.

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

### Semantic state should survive representation

The first adaptive entity-surface probe has earned a concrete separation: meaningful entity and surface state belongs to the semantic ECS world, while Three.js and DOM are disposable realizations of that state.

A spatial object may summon a reflowable web surface without either representation becoming the owner of the entity. The language surface may temporarily claim the entire viewport while the spatial runtime continues underneath.

This does not require every entity to have a permanently realized DOM tree, nor does it yet decide how many surfaces may be simultaneously realized.

### Source and executable are dual surfaces

Accessibility keeps inspectable source code and a continuously usable executable as distinct but connected surfaces.

Source is the ordinary construction surface. Root `index.html` on `main` is the stable promoted executable surface.

Build candidates are assembled from source by repository infrastructure, experienced before acceptance, and promoted as the exact bytes that were accepted. Humans should not need to download, locate, shuttle, or re-upload executable files as part of ordinary construction.

This boundary is itself subject to accessibility pressure: implementation machinery may be complex internally while the consequential human operations remain shaping and accepting behavior.

Executable publication work has now strengthened that direction. Infrastructure complexity does not need to be eliminated merely to lower the human entry barrier. It may instead be carried by the substrate and model-mediated workflow while the person retains consequential judgment. Increasing internal sophistication should not automatically increase the prerequisite operational vocabulary demanded of the human.

### Executable evidence earns architecture

Do not prematurely decide that the correct apparatus is Foundry, a node graph, a canvas, a conversational agent, a voice interface, or any other favored mechanism merely because it is familiar.

ECS has now been selected for the first implementation because it directly addresses an observed separation problem, but that selection remains falsifiable.

Build bounded probes. Observe use. Promote mechanisms and vocabulary when they prove useful.

Prefer the smallest cut that produces independently inspectable evidence. Long investigations should be composed from short, independently persistent model turns where practical. Git checkpoints reduce the amount of fragile private state that must survive a long run: interruption should ordinarily cost the current cut, not the whole expedition.

## Authority boundaries

- `SEMANTIC_SURFACE.md` records current earned constraints.
- `research/` preserves hypotheses and observations without making them requirements.
- `changes/` will preserve bounded implementation expeditions and actual outcomes.
- implementation owns realization details; modular source is the working surface and promoted `index.html` is the stable executable surface.
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

The repository now has enough build/runtime substrate to investigate entry and extensibility through executable use.

The current scene and card are probes, not the target product. Near-term work should test whether consequential capabilities can be reached through forgiving, coarse interaction and whether the apparatus can progressively support construction without turning into a fixed catalog of editor features.

Preserving negative space is preferable to filling the repository with speculative interface machinery.
