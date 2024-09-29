# DriftJS

A simple WinterCG compaitable web application framework.

[Installation](#installation)

## Installation

1. `bun install @drift-js/drift`
2. Setup your Drift server:

```ts
// src/index.ts
const app = new Drift().get("/", () => {
    return { message: "Hello, World!" };
});

Bun.serve({
    port: 3000,
    fetch: app.fetch,
});
```

3. Run using `bun run src/index.ts`
