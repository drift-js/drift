import { ContextWithMiddleware, DefaultContext, ExtractPathParams } from "./context";

import { DRIFT_ERROR } from "./error";
import { Middleware } from "./middleware";
import { UnionToIntersection } from "./utils";

export type DriftRoute<
    TContext = DefaultContext,
    TPath extends string = "",
    TMethod extends string = "",
    TData = any,
    TMiddlewares extends Middleware<any, any>[] = [Middleware<any, any>]
> = ContextWithMiddleware<TContext, TMiddlewares> extends {
    body: infer TInput;
    query: infer TQuery;
    params: infer TParams;
    errors: infer TErrors;
}
    ? {
          [key in TPath]: {
              [key in TMethod]: {
                  input: TInput;
                  query: TQuery;
                  params: 0 extends 1 & TParams ? ExtractPathParams<TPath> : TParams;
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
                      TErrors;
              };
          };
      }
    : never;
