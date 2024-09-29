import { UnionToIntersection } from "../core/utils";
import { DRIFT_ERROR } from "../core/error";
import { createMiddleware } from "../core/middleware";

export const onError = <TResponse>(errorHandler: (e: unknown) => TResponse) => {
    return createMiddleware<{
        errors: UnionToIntersection<
            TResponse extends {
                [DRIFT_ERROR]: any;
                code: number;
                data: infer TErrorData;
            }
                ? {
                      [key in TResponse["code"]]: TErrorData;
                  }
                : {
                      500: TResponse;
                  }
        >;
    }>(async ({ next }) => {
        try {
            return await next();
        } catch (error) {
            return errorHandler(error);
        }
    });
};
