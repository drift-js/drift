import { DefaultContext } from "../core/context";
import { createMiddleware } from "../core/middleware";

export const derive = <TResponse extends object>(fn: (context: DefaultContext) => TResponse | Promise<TResponse>) => {
    return createMiddleware<TResponse>(async ({ next, set, ...context }) => {
        const derived = await fn(context);

        (Object.keys(derived) as (keyof TResponse)[]).forEach((key) => {
            set(key, derived[key] as any);
        });

        return next();
    });
};
