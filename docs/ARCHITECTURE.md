# Sky Scout View Architecture

## Goals

- Lean, composable React components
- Separation of concerns: data acquisition vs presentation
- Future-friendly for Redux / RTK Query / Zustand without major rewrites
- Consistent formatting & linting (Prettier + ESLint)

## Layers

1. services/
   Low-level API/service helpers (e.g. `weatherService`). Keep side-effects & persistence (localStorage) here.

2. hooks/
   Encapsulate stateful UI/data logic (`useWindData`). This mirrors a potential Redux slice: state, async refresh (thunk-like), derived values (averages). Replacing with Redux later means:
   - Move reducer logic into a slice
   - Keep hook as a select/dispatch adapter or replace usages with `useSelector`/`useDispatch`.

3. components/
   - Presentational (stateless) or minimally stateful UI: `wind/CurrentWindPanel`, `wind/WindAverageStat`, existing shadcn/ui wrappers.
   - Avoid direct service calls; receive data via props.

4. pages/
   Composition & orchestration (`pages/SimpleView`). Minimal logic: invokes hooks, handles user interactions (manual refresh, toasts), and arranges components.

## State Evolution Strategy

| Current               | Future Redux                     | Notes                                                          |
| --------------------- | -------------------------------- | -------------------------------------------------------------- |
| `useWindData` reducer | Slice reducer (e.g. `windSlice`) | Action types already domain-oriented (LOADING/SUCCESS/ERROR).  |
| `refresh` function    | Thunk / RTK Query endpoint       | Keep same signature for easy swap.                             |
| Local polling         | Middleware / RTK Query polling   | Hook can become a thin wrapper to start/stop polling dispatch. |

## Adding Redux Later (Outline)

1. `npm install @reduxjs/toolkit react-redux`
2. Create `src/store/index.ts` and `windSlice.ts` (migrate reducer + initialState + actions)
3. Replace `useWindData` logic with selectors & dispatch actions; keep the public hook API for components
4. Gradually migrate other feature hooks with the same pattern

## Testing Considerations

- Hooks: test `computeAverages` logic in isolation by exporting it (or move to `lib/`)
- Components: snapshot + prop-driven tests (current speed formatting, direction labels)

## Formatting & Linting

- Pre-commit runs Prettier then ESLint (autofix) only on staged files
- Style decisions centralized in `.prettierrc.json` & `eslint.config.js`

## Directory Recap

```
services/        -> weatherService.ts
hooks/           -> useWindData.ts
components/wind/ -> CurrentWindPanel.tsx, WindAverageStat.tsx (barrel index)
pages/           -> SimpleView.tsx (container)
```

## Extensibility

- Additional metrics: extend `WindState` & compute in hook; pass new props down
- Theming / design tokens: centralize gradient & shadow vars in CSS and map via props if needed
- Error boundaries: introduce a `WeatherErrorBoundary` wrapper at page or layout level

---

Document last updated: ${new Date().toISOString()}
export _ from "./CurrentWindPanel";
export _ from "./WindAverageStat";
