import { Drift, error } from "src";
import { type } from "arktype";
import { body } from "src/validation/arktype";

const app = new Drift()
    .get("/users/:userId", () => {
        if (Math.random() > 0.5) {
            return error("Random", 501);
        }
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
    );

Bun.serve({
    port: 3000,
    fetch: app.fetch,
});

console.log("Server is running on http://localhost:3000");
