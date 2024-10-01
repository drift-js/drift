import { Drift, error } from "src";

import { body } from "src/validation/arktype";
import { derive } from "src/middleware/derive";
import { type } from "arktype";

export const app = new Drift()
    .get("/", () => {
        return { message: "Hello, World!" };
    })
    .get(
        "/user",
        derive(() => {
            return {
                user: {
                    name: "John Doe",
                    age: 25,
                    email: "johndoe@example.com",
                },
            };
        }),
        ({ user }) => {
            return user;
        }
    )
    .post(
        "/upload",
        body(
            type({
                message: "string",
                file: "File",
            })
        ),
        ({ body }) => {
            return {
                message: "File uploaded!",
            };
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
