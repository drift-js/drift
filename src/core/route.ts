import { ContextWithMiddleware, DefaultContext } from "./context";

import { DRIFT_ERROR } from "./error";
import { Middleware } from "./middleware";
import { UnionToIntersection } from "./utils";

export type DriftRoute<
    TContext = DefaultContext,
    TPath extends string = "",
    TMethod extends string = "",
    TData = any,
    TMiddlewares extends Middleware<any, any>[] = [Middleware<any, any>]
> = {
    [key in TPath]: {
        [key in TMethod]: {
            input: ContextWithMiddleware<TContext, TMiddlewares> extends { body: infer TInput } ? TInput : any;
            query: ContextWithMiddleware<TContext, TMiddlewares> extends { query: infer TQuery } ? TQuery : any;
            params: ContextWithMiddleware<TContext, TMiddlewares> extends { params: infer TParams } ? TParams : any;
            output: UnionToIntersection<
                TData extends {
                    [DRIFT_ERROR]: any;
                    code: number;
                    data: infer TErrorData;
                }
                    ? {
                          [key in TData["code"]]: TErrorData;
                      }
                    : {
                          200: TData;
                      }
            > &
                ContextWithMiddleware<TContext, TMiddlewares> extends { errors: infer TErrors }
                ? TErrors
                : any;
        };
    };
};
