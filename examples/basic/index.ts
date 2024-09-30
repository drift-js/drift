import { Drift, error } from "src";
import { type } from "arktype";
import { body } from "src/validation/arktype";

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
    .get("/user/:userId/posts/:postId", ({ params }) => {
        console.log(params);
    });

Bun.serve({
    port: 3000,
    fetch: app.fetch,
});

console.log("Server is running on http://localhost:3000");
