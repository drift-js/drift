import { error } from "../core/error";
import { createMiddleware } from "../core/middleware";
import { type, Type } from "arktype";

export const params = <const TSchema extends Type>(schema: TSchema) => {
    return createMiddleware<{ params: TSchema["infer"] }>(async ({ query, set, next }) => {
        const out = schema(query);
        if (out instanceof type.errors) {
            return error(
                {
                    message: "Invalid params",
                    errors: out.map((err) => ({
                        path: err.path,
                        code: err.code,
                        message: err.message,
                    })),
                },
                400
            );
        }
        set("params", out);
        return next();
    });
};

export const query = <const TSchema extends Type>(schema: TSchema) => {
    return createMiddleware<{ query: TSchema["infer"] }>(async ({ query, set, next }) => {
        const out = schema(query);
        if (out instanceof type.errors) {
            return error(
                {
                    message: "Invalid query",
                    errors: out.map((err) => ({
                        path: err.path,
                        code: err.code,
                        message: err.message,
                    })),
                },
                400
            );
        }
        set("query", out);
        return next();
    });
};

export const body = <const TSchema extends Type>(schema: TSchema) => {
    return createMiddleware<{ body: TSchema["infer"] }>(async ({ body, set, next }) => {
        const out = schema(body);
        if (out instanceof type.errors) {
            return error(
                {
                    message: "Invalid body",
                    errors: out.map((err) => ({
                        path: err.path,
                        code: err.code,
                        message: err.message,
                    })),
                },
                400
            );
        }
        set("body", out);
        return next();
    });
};
