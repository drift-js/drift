import { Drift, error } from "src";

import { body } from "src/validation/arktype";
import { type } from "arktype";

export const app = new Drift()
    .get("/", () => {
        return { message: "Hello, World!" };
    })
    .post(
        "/upload",
        body(
            type({
                message: "string",
                file: "File",
            })
        ),
        ({ body }) => {
            console.log(body);
        }
    )
    .get("/users/:userId/posts/:postId", ({ params }) => {
        if (Math.random() > 0.5) {
            return error({
                message: "Failed to retrieve post " + params.postId,
            });
        }
        return {
            id: "hello",
        };
    });

Bun.serve({
    port: 1234,
    fetch: app.fetch,
});

console.log("Server is running on http://localhost:1234");
