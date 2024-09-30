import { app } from "examples/basic";
import { client } from "src/client";

const $fetch = client<typeof app>("http://localhost:1234");

const result = await $fetch("/users/:userId/posts/:postId", {
    method: "GET",
    params: {
        userId: "1",
        postId: "2",
    },
});

console.log(result);
