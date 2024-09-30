export type Unwrap<T> = T extends object ? { [K in keyof T]: Unwrap<T[K]> } : T;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type OmitEmptyObject<T> = {
    [K in keyof T as {} extends T[K] ? never : K]: T[K];
};

export function containsFile(obj: Record<string, any>): boolean {
    for (let key in obj) {
        if (obj[key] instanceof File || obj[key] instanceof Blob) {
            return true;
        }
        if (Array.isArray(obj[key])) {
            for (let item of obj[key]) {
                if (item instanceof File || item instanceof Blob) {
                    return true;
                }
            }
        }
    }
    return false;
}
