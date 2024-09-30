import { app } from "examples/basic";
import type { Drift } from "../";

type DriftClientFetcherOptions<TRoute> = {};

type DriftClientFetcher<TRoutes> = TRoutes extends Record<string, any>
    ? <K extends keyof TRoutes>(path: K, options: DriftClientFetcherOptions<TRoutes[K]>) => TRoutes[K]
    : never;

type DriftClient<TDrift extends Drift> = TDrift extends Drift<any, infer TRoutes> ? DriftClientFetcher<TRoutes> : never;

type Client = DriftClient<typeof app>;

export const client = <TDrift extends Drift>(): DriftClient<TDrift> => {
    return {} as DriftClient<TDrift>;
};

const $fetch = client<typeof app>();

const response = $fetch("/user/:userId/posts/:postId", {});
