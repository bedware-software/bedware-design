import type { Ref } from 'react';
/** Склеивает имена классов, пропуская пустые. */
export declare function cx(...parts: Array<string | false | null | undefined>): string;
/** Один ref на несколько получателей. */
export declare function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void;
