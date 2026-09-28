# Multimodal Reference

**Status:** open research note  
**Date:** 2026-09-27

This note preserves a small field observation that may matter to Accessibility. It is evidence, not a requirement or an interaction design.

## Observation

A person naturally communicated by sending a screenshot of what they were watching.

The image was not supplementary to a carefully composed textual message. In practical terms, the image itself functioned as the utterance: *this is what I am looking at.*

A collaborator then referred to a particular name visible inside the screenshot. The recipient initially could not perceive that name. After its location and relevance became apparent, the response was:

> “I see the name now it's very faint”

The information was therefore semantically present in the shared artifact but perceptually low-salience.

## Why this may matter

Accessibility should not quietly interpret “incomplete ideas are legitimate starting material” as “incomplete verbal ideas are legitimate starting material.”

Human intention and reference may arrive as:

- an image or screenshot;
- a photograph;
- a scribble;
- a coarse selection or tap;
- a spoken fragment;
- pasted material;
- text;
- combinations of these.

The cheapest available expression may itself be an accessibility mechanism.

The observation also exposes a distinction between **semantic presence** and **perceptual accessibility**.

A detail can exist in shared media, be available to a model or collaborator, and still be difficult for the person to recover visually. Enlarging the entire artifact is one possible response, but it is not necessarily the semantic operation the person needs.

The useful operation may instead resemble:

> “Show me the thing you're talking about.”

That could imply highlighting, extraction, reflow, enlargement, spoken rendering, isolation, or some mechanism not yet discovered.

## Research questions

Can received media participate directly in the same shared reference space as constructed entities?

Can a person communicate with an image without first translating the image into words for the apparatus?

When a collaborator or model refers to something inside an image, can the system make that referent perceptually available without requiring precise manual navigation?

Can the system transform presentation while preserving semantic identity — for example, taking faint text embedded in an image and presenting it as large reflowable text without losing the fact that both representations refer to the same thing?

Can the easiest modality change from moment to moment without requiring explicit mode management?

What should happen when a model can perceive a detail that the human cannot readily perceive?

How should the system distinguish “the information is present” from “the information is accessible”?

## Relationship to existing semantic commitments

This observation is consistent with several current commitments in `SEMANTIC_SURFACE.md`:

- accessibility is the substrate rather than a single modality;
- multiple forms of reference should remain possible;
- text must tolerate extreme enlargement;
- precision should not be a prerequisite for expressive power;
- incomplete ideas are legitimate starting material.

It does **not** yet justify promoting image input, screenshot understanding, visual highlighting, OCR, or any particular multimodal architecture into the Semantic Surface.

The evidence is smaller and more useful than that:

**A naturally chosen image can function as an utterance, while a semantically relevant detail inside that same image can remain perceptually inaccessible.**

That distinction is worth carrying into the first executable probes.
