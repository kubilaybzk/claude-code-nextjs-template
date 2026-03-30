# State Management Rules

## Server State → React Query

React Query cache is the single source of truth for all backend data. Never duplicate server state in Redux.

## Client State → Redux (feature store)

Feature `store/` is created **only when explicitly requested** for client-only state:
- Wizard step tracking
- Multi-step form data accumulation

Never use it for server data.

## Global Store

`src/store/` contains only `configureStore` + root reducer wiring. No slice definitions here — slices live in `features/[name]/store/`.
