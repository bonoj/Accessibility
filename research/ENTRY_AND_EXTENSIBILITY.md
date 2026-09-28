# Entry and Extensibility

Status: research observation  
Date: 2026-09-28

## Observation

The development process is exposing an accessibility question on both sides of the executable.

A person with access to a smartphone, a capable model, the deployed candidate, and enough understanding to recognize and steer the behavior under investigation can move from an incomplete idea to executable evidence with very little conventional software-production ceremony.

The observed loop is approximately:

**idea → conversation → small source change → automatic build → live candidate → experience → observation → next change**

The human need not personally operate an IDE, assemble build artifacts, move files between systems, or directly manipulate the implementation language for every change.

This does not remove the need for understanding. It may change which understanding is required. A person may be able to begin useful construction by understanding the domain, recognizing interesting or unwanted behavior, expressing intent, and making consequential judgments while a capable model carries more of the implementation mechanics.

## Accessibility consequence

Lowering the barrier to entry is not sufficient if doing so narrows the space of things the person may eventually construct.

Many simplified systems achieve approachability by preauthoring the available vocabulary, workflows, or outcomes. Accessibility is investigating a different possibility:

> **Lower the barrier to entry while widening support for people to build their own tools.**

This extends the existing shorthand **low floor without a low ceiling**. The desired substrate should make the first meaningful experiment inexpensive without requiring later work to remain inside a small catalog of predesigned capabilities.

Model-mediated extensibility is therefore relevant not only as implementation convenience but as a possible accessibility mechanism. Complexity may remain in source, architecture, build systems, or generated behavior without requiring every builder to operate that complexity directly.

## 3D is capability, not prerequisite

The current apparatus uses Three.js because navigable spatial worlds are a useful and demanding test environment.

The project does not require a person to build in 3D.

3D should remain available to people who want or need spatial construction without becoming the mandatory representation through which every person must understand or manipulate the system. Text, conversation, images, diagrams, lists, or other representations may become equally legitimate surfaces when executable evidence earns them.

The reusable target is therefore broader than an accessible 3D editor. It is an extensible construction substrate capable of supporting spatial worlds among other forms.

## Evidence from the first card probe

The first scene-driven card probe exposed a small but useful failure.

Tapping a spatial ball summoned lightweight contextual UI. The surface was easy to dismiss, but that ease became hostile when considering pinch enlargement: a missed first touch could dismiss the very surface the person was trying to make easier to read.

This suggests two provisional directions:

- accidental or imprecise input should have low recovery cost;
- coordinated gestures may accelerate interaction, but accessibility-critical capability should not depend on them when a coarse sequential action can provide the same capability.

These are observations from one probe, not a completed interaction grammar.

## Question now

The immediate question is no longer merely whether an accessible interface can operate a sophisticated construction system.

It is also:

> **How little apparatus must a person personally operate before they can begin extending the apparatus itself toward the tool they need?**

Keep this question executable. Do not answer it by prebuilding a universal editor.
