import { app } from "examples/basic";
import { client } from "src/client";

const $fetch = client<typeof app>("http://localhost:1234");

const result = await $fetch("/upload", {
    method: "POST",
    input: {
        message: "Hello, World!",
        file: new File(["Hello, World!"], "hello.txt"),
    },
});
