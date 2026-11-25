/** Склеивает имена классов, пропуская пустые. */
export function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
/** Один ref на несколько получателей. */
export function mergeRefs(...refs) {
    return (node) => {
        for (const ref of refs) {
            if (typeof ref === 'function')
                ref(node);
            else if (ref)
                ref.current = node;
        }
    };
}
//# sourceMappingURL=util.js.map