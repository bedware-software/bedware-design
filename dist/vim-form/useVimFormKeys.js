// Всё вместе для формы настроек: контроллер, метки, режимы COMMAND / INSERT, таблица клавиш.
// Обвязка поверх useVimForm, useVimFormHints и useVimFormMode — так их соединяет окно настроек
// Vimperium (SettingsDialog.tsx), без его собственных состояний (поиск, несохранённые изменения).
// Форме, которой нужно больше, чем здесь, эти три хука доступны по отдельности.
import { useRef, useState } from 'react';
import { useVimForm, useVimFormLabelCount } from './form';
import { hintIndex, useVimFormHints } from './hints';
import { DEFAULT_VIM_FORM_KEYMAP } from './keymap';
import { useVimFormMode } from './mode';
/**
 * Клавиши Vim для формы настроек. Порядок Esc: открытый список → таблица клавиш → `onEscape`.
 * Команды: метка — переход к элементу; `help` — таблица клавиш; затем `onCommand` приложения;
 * остальное — контроллеру формы (курсор, значение, нажатие, вход в поле, клавиши строк).
 */
export function useVimFormKeys({ enabled = true, keymap = DEFAULT_VIM_FORM_KEYMAP, win = typeof window === 'undefined' ? null : window, root, scrollRoot, resetKey, open = true, onCommand, onEscape, escapeLeavesField = false, passThrough, warn, repeatable, countable, }) {
    const base = enabled ? keymap : null;
    const form = useVimForm({ enabled: base !== null, root, scrollRoot, resetKey, warn });
    const labelCount = useVimFormLabelCount(form);
    const hints = useVimFormHints(base, labelCount);
    const [helpOpen, setHelpOpen] = useState(false);
    const helpOpenRef = useRef(helpOpen);
    helpOpenRef.current = helpOpen;
    const run = (command) => {
        const hinted = hintIndex(command);
        if (hinted !== null) {
            if (!form.getSnapshot().overlayOpen)
                form.pickLabel(hinted);
            return;
        }
        if (command === 'help') {
            setHelpOpen((shown) => !shown);
            return;
        }
        // Пока открыта таблица клавиш, форма под ней не двигается: закрыть — «?» или Esc.
        if (helpOpenRef.current)
            return;
        if (onCommand?.(command) === true)
            return;
        form.run(command);
    };
    const escape = (from) => {
        if (escapeLeavesField && from === 'insert')
            return;
        if (form.escapeOverlay())
            return;
        if (helpOpenRef.current) {
            setHelpOpen(false);
            return;
        }
        onEscape?.();
    };
    const vim = useVimFormMode({
        keymap: hints.keymap,
        popup: win,
        open,
        anyField: true,
        // Модальный диалог пакета в том же документе и запись сочетания клавиш забирают клавиши себе.
        passThrough: () => passThrough?.() === true || win?.document.querySelector('[aria-modal="true"], [data-recording]') != null,
        onCommand: run,
        onEscape: escape,
        repeatable,
        countable,
    });
    return { form, mode: vim.mode, pending: vim.pending, labels: hints.labels, keymap: base, helpOpen, setHelpOpen };
}
//# sourceMappingURL=useVimFormKeys.js.map