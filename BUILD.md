# Build and Promotion

Accessibility intentionally maintains two related surfaces:

- modular source code for inspection, extension, and ordinary engineering work;
- root `index.html` on `main` as the stable promoted executable.

The stable executable is not the workspace.

## Candidate build

Source and build-tool changes on `main` trigger the **Build candidate** GitHub Actions workflow. The workflow can also be started manually.

The build runs from a clean checkout with pinned tooling and emits:

`dist/index.html`

The candidate is a single self-contained HTML artifact. GitHub retains it as a workflow artifact rather than writing it back into the repository.

Local equivalent:

```sh
npm ci
npm run build
```

## Promotion

A candidate should be experienced and inspected before promotion.

Promotion means taking the accepted candidate bytes and replacing root `index.html` on `main` with those bytes. Publication should not rebuild the candidate or reconstruct it through a second code path.

Therefore:

**source → clean candidate build → inspection → exact-byte promotion → stable index.html**

A rejected candidate changes nothing about the published executable.

## Why this boundary exists

The source tree is expected to remain navigable as the implementation grows. The published artifact is expected to remain immediately executable and easy to hand to a person or model.

Neither requirement should force the other into an awkward representation.

GitHub Actions provides reproducible assembly without making generated monolithic HTML the primary editing surface.
