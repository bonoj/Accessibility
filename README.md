# Accessibility

Executable research into accessible human–model construction, preserving expressive power while reducing barriers to creation.

## Research question

How little prerequisite knowledge, physical precision, perceptual effort, and interface machinery can stand between a person having an idea and making that idea concrete without lowering the eventual expressive ceiling?

The project does not assume the answer is voice, simplified software, a node editor, Three.js, a particular accessibility mode, a particular population, or any one interaction modality.

A useful shorthand is:

> **Low floor without a low ceiling.**

The current work sharpens that into a second constraint: lower the barrier to beginning while widening support for people to build tools the original apparatus did not anticipate.

Accessibility is treated here as a property of the construction substrate, not as a special mode for a designated class of user. Navigable 3D worlds are an important capability and experimental pressure, not a required construction medium.

## Method

The project inherits an executable research practice:

**human consequential intent → smallest useful executable hypothesis → experience → evidence → correction → repeated evidence → semantic or architectural promotion where earned → next hypothesis**

The first apparatus should be small enough that accessibility pressure can shape it from the beginning rather than being retrofitted after its interaction model hardens.

Implementation proceeds in small independently persistent cuts where practical. This is both Git hygiene and research machinery: executable checkpoints keep interruption or model-run timeout from turning a long investigation into one fragile unit of progress.

## Repository surfaces

- `SEMANTIC_SURFACE.md` — present-tense truths that currently deserve to constrain work.
- `research/` — observations, hypotheses, prior evidence, and questions worth preserving without granting them authority.
- `src/probes/` — preserved executable specimens that exercise the shared substrate without defining the product.
- `changes/` — bounded implementation expeditions once implementation begins: intended uncertainty, evidence sought, actual outcome, and any resulting promotions.
- `src/` — inspectable implementation source used for ordinary construction work.
- candidate builds — web-addressable executable evidence assembled by GitHub from exact source commits.
- root `index.html` — stable promoted executable; accepted candidate bytes, not the editing surface.
- `BUILD.md` — build, candidate, experience, and promotion contract.
- Git history — exact implementation and semantic lineage.

Research notes are non-authoritative. Their presence does not require implementation.

## Lineage

This project inherits a research practice rather than an implementation fork.

The distinction between semantic authority, provisional research, change archaeology, executable evidence, and Git lineage was developed through [World Lab](https://github.com/bonoj/world-lab). The same inheritance pattern is already being used by [Digital Familiar](https://github.com/bonoj/DigitalFamiliar).

[Foundry](https://github.com/bonoj/Foundry) is useful prior evidence that a sparse executable substrate can acquire concrete entities, behaviors, relationships, and increasingly sophisticated systems through iterative construction. Accessibility does not inherit Foundry's ontology or implementation by default.

Source projects remain sovereign over what they learned. Accessibility may link to prior evidence, borrow a mechanism when justified, or realize a related idea differently. Nothing is copied merely to establish lineage.

## Current state

The repository now has a deliberately minimal executable and a source-first build spine.

Ordinary work happens in modular source. GitHub assembles source changes into candidates without changing the stable root `index.html`. Accepted candidates can be promoted byte-for-byte without requiring a human to handle executable files.

The implementation itself remains intentionally sparse. The first adaptive entity-surface probe is preserved as an executable specimen: a semantic entity owns ECS surface state while DOM and Three.js remain realizations rather than owners. The card experience is evidence, not a product shell.

The next architectural test is to make surface realization an ordinary capability of arbitrary entities. The broader work remains forgiving access to capability and progressively extensible construction: how little apparatus must a person personally operate before they can begin making the apparatus more useful for what they are trying to build?
