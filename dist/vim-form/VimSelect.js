import { jsx as _jsx } from "react/jsx-runtime";
// Select с клавишами формы Vim: закрыт — h / l меняют значение; открыт — клавиши формы идут в
// список, потому что в режиме Vim клавиатура не уходит из окна формы.
// Перенесено из Vimperium (components/VimSelect.tsx).
import { useContext, useEffect, useRef, useState } from 'react';
import { Select } from '../Select';
import { VimFormContext, setItemStepper } from './form';
export function VimSelect({ vimItem, ...select }) {
    const form = useContext(VimFormContext);
    const triggerRef = useRef(null);
    const handle = useRef(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const el = triggerRef.current;
        if (!el)
            return;
        setItemStepper(el, (delta) => handle.current?.step(delta));
        return () => setItemStepper(el, null);
    }, []);
    useEffect(() => {
        if (!open || !form)
            return;
        return form.openOverlay({
            command: (command) => {
                const list = handle.current;
                switch (command) {
                    case 'cursor-down':
                    case 'value-next':
                        list?.move(1);
                        break;
                    case 'cursor-up':
                    case 'value-prev':
                        list?.move(-1);
                        break;
                    case 'half-page-down':
                    case 'value-next-big':
                        list?.move(5);
                        break;
                    case 'half-page-up':
                    case 'value-prev-big':
                        list?.move(-5);
                        break;
                    case 'cursor-first':
                        list?.moveTo('first');
                        break;
                    case 'cursor-last':
                        list?.moveTo('last');
                        break;
                    case 'activate':
                    case 'toggle':
                        list?.pick(false);
                        break;
                }
                // Всё остальное, что сделали бы клавиши формы, ждёт, пока список закроется.
                return true;
            },
            escape: () => handle.current?.close(false),
        });
    }, [open, form]);
    return (_jsx(Select, { ...select, ref: triggerRef, handle: handle, onOpenChange: setOpen, "data-vim-item": vimItem, "data-vim-kind": "select" }));
}
//# sourceMappingURL=VimSelect.js.map