# Build and Promotion

Accessibility maintains two related implementation surfaces:

- modular source code for inspection, extension, and ordinary engineering work;
- root `index.html` on `main` as the stable promoted executable.

The stable executable is not the workspace, and a human should not need to transport executable files between these surfaces.

## Candidate build

Source and build-tool changes on `main` trigger the **Build candidate** GitHub Actions workflow. The workflow can also be started manually.

The build runs from a clean checkout and emits a single self-contained HTML artifact.

Each successful build preserves an immutable GitHub Actions artifact identified by the exact source commit and content digest.

Candidate generation never commits generated output back to `main`. The source/stable branch therefore cannot race its own build machinery.

The root `index.html` is not changed by candidate creation. A rejected candidate therefore cannot replace the stable published executable.

Local equivalent:

```sh
npm install
npm run build
```

Local building is useful for engineering but is not required for the human construction loop.

## Experience

A candidate is identified by the exact source commit from which it was built.

Human preview publication is deliberately separate from candidate provenance.

GitHub Pages is assembled as a deployment surface rather than committed build output:

- `/` receives the stable root `index.html` from `main`;
- `/preview/` receives the exact immutable artifact from the successful candidate build currently under inspection.

The Pages deployment does not write either representation back into source history. Candidate preview can therefore remain a one-tap phone web operation without making generated output part of `main` or requiring a second build.

This requires the repository's Pages source to be **GitHub Actions** rather than **Deploy from a branch**.

## Promotion

Promotion normally means **promote the candidate currently deployed at `/preview/`**. The Pages surface publishes that preview's source identity as machine-readable deployment metadata, so the human does not need to transcribe a commit SHA. An explicit source SHA remains available as an engineering/debug escape hatch.

Promotion ultimately resolves the source-commit identity of an already built candidate.

The **Promote candidate** workflow validates that candidate, copies its existing bytes to root `index.html`, verifies byte equality, and commits the result to `main`.

Promotion does **not** rebuild.

Candidate artifacts are created by the separate **Build candidate** workflow. Artifact discovery may be repository-wide, but `actions/download-artifact` normally resolves artifacts in the current workflow run. Promotion therefore downloads the already-resolved immutable artifact ID through GitHub's Actions artifact API. This cross-workflow boundary is intentional: do not replace it with a current-run artifact download unless the workflow architecture itself changes.

Before allowing promotion to write stable output, the transport seam may be tested independently: resolve a known candidate artifact, download it by immutable artifact ID, unpack it, verify the embedded candidate SHA, and compare its digest without copying it to root `index.html` or committing anything.

Therefore:

**conversation → source change → clean GitHub build → web candidate → human acceptance → exact-byte promotion → stable index.html**

The candidate that was experienced is the executable that is published.

A connected model may perform the same promotion by reading the accepted candidate from the repository and replacing root `index.html` with those exact bytes. The semantic operation is the same: promote an existing candidate; do not reconstruct one.

## Scale boundary

The source tree may grow without changing the publication contract. Modules, assets, generated data, tests, and build tooling remain ordinary repository files. The build boundary is responsible for assembling them into the self-contained executable when that remains the useful publication form.

The monolithic HTML is therefore a release representation, not the primary editing representation.

## Human boundary

The intended human loop contains two consequential decisions:

1. shape what should be built;
2. accept or reject experienced behavior.

Build assembly, executable transport, candidate bookkeeping, and publication mechanics are infrastructure. They should not demand file-manager dexterity or desktop intervention merely because the implementation is large.
