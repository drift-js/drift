import { OmitEmptyObject, Unwrap } from "../core/utils";

import { Drift } from "../core/framework";
import { DriftRouteData } from "..";
import { app } from "examples/basic";
import type { UseQueryOptions } from "@tanstack/react-query";

export type ExtractGetPaths<TRoute extends DriftRouteData> = Unwrap<
    {
        [key in keyof TRoute]: "GET" extends keyof TRoute[key] ? key : never;
    }[keyof TRoute]
>;

export type UseDriftQueryOptions<TParams = {}, TQuery = {}> = OmitEmptyObject<{
    params: TParams;
    query: TQuery;
}>;

export type UseDriftQuery<
    TRoute extends DriftRouteData,
    TPath extends ExtractGetPaths<TRoute> = ExtractGetPaths<TRoute>
> = keyof TRoute[TPath] extends "GET"
    ? {
          useQuery: <const TPath extends ExtractGetPaths<TRoute>>(
              path: TPath,
              options: Unwrap<
                  UseDriftQueryOptions<
                      TRoute[TPath]["GET"] extends { params: infer TParams } ? TParams : never,
                      TRoute[TPath]["GET"] extends { query: infer TQuery } ? TQuery : never
                  > &
                      Omit<UseQueryOptions, "queryKey" | "queryFn">
              >
          ) => {};
      }
    : {};

export type DriftQueryHooks<TRoute> = TRoute extends DriftRouteData ? UseDriftQuery<TRoute> : never;

export type DriftQueryClient<TDrift extends Drift> = TDrift extends Drift<any, infer TRoute>
    ? DriftQueryHooks<TRoute>
    : never;

export const createReactQueryHooks = <TDrift extends Drift>(base: string): DriftQueryClient<TDrift> => {
    return {} as any;
};

const { useQuery } = createReactQueryHooks<typeof app>("");

useQuery("/user", {});
