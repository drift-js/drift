import { body } from "src/validation/arktype";

import { Drift } from "src";
import { type } from "arktype";

const app = new Drift()
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
    );

Bun.serve({
    port: 3000,
    fetch: app.fetch,
});

console.log("Server is running on http://localhost:3000");
