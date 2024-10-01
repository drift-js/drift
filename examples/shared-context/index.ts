import { Drift, createMiddleware } from "src";

const middleware = createMiddleware<{ version: number }>(async ({ next, set }) => {
    set("version", 1);
    return next();
});

const context = new Drift().use(middleware);

const router1 = new Drift().use(context).get("/version", ({ version }) => {
    return { version };
});

const router2 = new Drift().use(context).get("/", ({ version }) => {
    return { message: "Hello version " + version };
});

const router3 = new Drift().get("/noversion", () => {
    return { message: "This endpoint doesn't have access to version" };
});

const app = new Drift().merge(router1).merge(router2).merge(router3);

Bun.serve({
    port: 1234,
    fetch: app.fetch,
});
