import { Drift, DriftRouteData } from "../";

export type InferFactory<TDrift extends Drift> = TDrift extends Drift<any, infer TRoute>
    ? TRoute extends DriftRouteData
        ? {
              [RouteKey in keyof TRoute]: TRoute[RouteKey];
          }
        : never
    : never;
