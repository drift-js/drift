import { containsFile, OmitEmptyObject, Unwrap } from "../core/utils";
import type { Drift } from "../";
import type { IntRange } from "type-fest";

export type DriftRouteData = {
    [key: string]: {
        [key: string]:
            | {
                  output: any;
              }
            | {
                  input: any;
              }
            | {
                  query: any;
              }
            | {
                  params: any;
              };
    };
};

export type DriftClientFetcherOptions<TMethod, TInput = {}, TParams = {}, TQuery = {}> = OmitEmptyObject<{
    method: TMethod;
    input: TInput;
    params: TParams;
    query: TQuery;
}>;

export type SuccessStatusCodes = IntRange<200, 300>;

export type SuccessResponse<TOutput> = {
    data: [Extract<keyof TOutput, SuccessStatusCodes>] extends [never]
        ? null
        : TOutput[Extract<keyof TOutput, SuccessStatusCodes>];
    error: undefined;
};

export type ErrorResponse<TOutput> = {
    data: undefined;
    error:
        | {
              [K in keyof Omit<TOutput, SuccessStatusCodes>]: {
                  code: K;
                  data: Omit<TOutput, SuccessStatusCodes>[K];
              };
          }[keyof Omit<TOutput, SuccessStatusCodes>]
        | {
              code: number;
              data: any;
          };
};

export type DriftResponse<TOutput> = SuccessResponse<TOutput> | ErrorResponse<TOutput>;

export type DriftClientFetcher<TRoute> = TRoute extends DriftRouteData
    ? <const TPath extends keyof TRoute, const TMethod extends keyof TRoute[TPath]>(
          path: TPath,
          options: Unwrap<
              DriftClientFetcherOptions<
                  TMethod,
                  TRoute[TPath][TMethod] extends { input: infer TInput } ? TInput : never,
                  TRoute[TPath][TMethod] extends { params: infer TParams } ? TParams : never,
                  TRoute[TPath][TMethod] extends { query: infer TQuery } ? TQuery : never
              >
          > &
              Omit<FetchRequestInit, "method">
      ) => Promise<DriftResponse<TRoute[TPath][TMethod] extends { output: infer TOutput } ? TOutput : never>>
    : never;

export type DriftClient<TDrift extends Drift> = TDrift extends Drift<any, infer TRoute>
    ? DriftClientFetcher<TRoute>
    : never;

export const client = <TDrift extends Drift>(base: string): DriftClient<TDrift> => {
    const $fetch = async (path: string, options: any = {}) => {
        const { method, input, params, query, ...rest } = options;

        let pathToFetch = path;

        if (params) {
            Object.keys(params).forEach((key) => {
                pathToFetch = pathToFetch.replace(`:${key}`, params[key]);
            });
        }

        const url = new URL(pathToFetch, base);

        if (query) {
            Object.keys(query).forEach((key) => {
                url.searchParams.append(key, query[key]);
            });
        }

        let body;
        if (input) {
            if (containsFile(input)) {
                const formData = new FormData();
                for (let key in input) {
                    if (Array.isArray(input[key])) {
                        input[key].forEach((item) => formData.append(key, item));
                    } else {
                        formData.append(key, input[key]);
                    }
                }
                body = formData;
            } else {
                body = JSON.stringify(input);
            }
        } else {
            body = undefined;
        }
        const response = await fetch(url, {
            method,
            ...rest,
            ...(body
                ? {
                      body,
                      headers: {
                          ...(options?.headers || {}),
                          ...(containsFile(input) ? {} : { "Content-Type": "application/json" }),
                          Accept: "application/json",
                      },
                  }
                : {
                      headers: {
                          ...(options?.headers || {}),
                          Accept: "application/json",
                      },
                  }),
        });

        let data;

        switch (response.headers.get("Content-Type")) {
            case "application/json":
                data = await response.json();
                break;
            default:
                data = await response.text();
                break;
        }

        if (response.ok) {
            return { data, error: undefined };
        } else {
            return {
                data: undefined,
                error: {
                    code: response.status,
                    data,
                },
            };
        }
    };

    return $fetch as DriftClient<TDrift>;
};
