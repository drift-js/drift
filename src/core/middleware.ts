import { DefaultContext } from "./context";

export type MiddlewareContext<TNewContext> = {
    set: <const TKey extends keyof TNewContext, TValue extends TNewContext[TKey]>(key: TKey, value: TValue) => void;
    next: () => Promise<any>;
};

export type Middleware<TContext = DefaultContext, TNewContext = {}> = <T extends TNewContext>(
    context: TContext & MiddlewareContext<T>
) => Promise<any>;

export const createMiddleware = <TContext = {}>(middlewareFn: Middleware<DefaultContext, TContext>) => {
    return middlewareFn;
};
