import { ArkType, Drift } from "src";

import { type } from "arktype";

const app = new Drift()
    .get("/users/:userId", () => {
        return { message: "Hello, World!" };
    })
    .post(
        "/upload",
        ArkType.body(
            type({
                message: "string",
                file: "File",
            })
        ),
        ({ body }) => {
            console.log(body);
        }
    );

Bun.serve({
    port: 3000,
    fetch: app.fetch,
});

console.log("Server is running on http://localhost:3000");
