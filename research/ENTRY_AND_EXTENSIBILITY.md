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

## Infrastructure complexity can move away from the human

The publication work produced a second kind of executable evidence.

During one phone-mediated session, the repository moved from manual artifact transport toward a source-driven deployment path with clean candidate builds, immutable build artifacts, a continuously available phone preview, exact-byte promotion, and stable Pages publication.

Several failures occurred while assembling that path. Diagnosing them required reasoning across specialized implementation details including workflow event semantics, workflow-token trigger behavior, cross-workflow artifact scope, immutable artifact identity, Pages assembly, and deployment artifacts. The human did not need to learn or directly operate those mechanisms in order to continue the investigation. The consequential human observations remained ordinary statements such as:

- the preview behaves correctly;
- promote what I am looking at;
- the root site has not changed yet.

The model could then inspect execution evidence, isolate the failing layer, make a bounded source or workflow change, persist the repair, and try again.

This does not demonstrate that operational expertise is unnecessary, nor that models can reliably replace specialist infrastructure work. It does provide concrete evidence for a narrower proposition:

> **Model-mediated construction allowed infrastructure complexity to increase while the prerequisite operational vocabulary demanded of the human decreased.**

The sophistication of the resulting machinery did not require a corresponding increase in the sophistication of the human-facing controls. In this case, additional machinery was useful precisely because it removed artifact transport, commit identifiers, build mechanics, and deployment details from the ordinary human loop.

This suggests a useful distinction for Accessibility: complexity itself is not necessarily the barrier. Requiring the person to personally carry that complexity may be.

The session also reinforced the value of persistent small cuts. Each diagnosed failure could be converted into repository machinery and documentation so that future work inherits the result rather than depending on either participant remembering the debugging session. Git and CI therefore served not only as software-production infrastructure but as durable context for continued human–model construction.

## Execution, persistence, and inference are separate capabilities

The current browser-hosted apparatus already executes a live simulation. Wanting durable state does not imply that the simulation itself should move to a server.

A useful decomposition is:

**browser runtime = active simulation and immediate interaction**  
**durable backend = state and history that should survive or be shared**  
**Git = apparatus source and executable lineage**  
**model inference = an independent capability that may be local or remote when an experiment earns it**

This preserves architectural negative space. A Three.js world may remain entirely browser-hosted while selected semantic state is pushed to and pulled from a durable service. Likewise, adding persistence does not require choosing a model provider, an agent architecture, or continuous server-side execution.

The distinction suggests a small future persistence probe: change semantic state in one running world, persist it, destroy or reload the browser context, and recover that state. A subsequent probe could test the same durable state across two clients. No broader backend architecture is earned merely by posing those experiments.

## Question now

The immediate question is no longer merely whether an accessible interface can operate a sophisticated construction system.

It is also:

> **How little apparatus must a person personally operate before they can begin extending the apparatus itself toward the tool they need?**

Keep this question executable. Do not answer it by prebuilding a universal editor.
