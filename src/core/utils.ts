export type Unwrap<T> = T extends object ? { [K in keyof T]: Unwrap<T[K]> } : T;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
