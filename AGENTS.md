# AGENTS.md

## Frontend View Structure

For complex pages under `src/views`, use the `index / components / hooks` structure.

- `index.tsx` should compose the page and wire top-level layout only.
- `components/` should contain page-specific UI components.
- `hooks/` should contain page-specific queries, mutations, derived state, and side-effect logic.
- Each component with non-trivial styles should have its own `ComponentName.module.scss`.
- Keep `index.module.scss` limited to page-level layout styles, such as `.page`, `.header`, `.state`, and high-level list containers.
- Do not put large component logic or component-specific styles directly in `index.tsx` or `index.module.scss` when the page has multiple responsibilities.

When adding or refactoring a view, follow the existing nearby patterns first. If a simple page grows beyond a single responsibility, split it before adding more behavior.
