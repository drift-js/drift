import { DefaultContext, ContextWithMiddleware } from "./context";
import { Middleware } from "./middleware";
import { DRIFT_ERROR } from "./error";
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
            // @ts-ignore
            input: ContextWithMiddleware<TContext, TMiddlewares>["body"];
            // @ts-ignore
            query: ContextWithMiddleware<TContext, TMiddlewares>["query"];
            // @ts-ignore
            params: ContextWithMiddleware<TContext, TMiddlewares>["params"];
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
                // @ts-ignore
                ContextWithMiddleware<TContext, TMiddlewares>["errors"];
        };
    };
};
