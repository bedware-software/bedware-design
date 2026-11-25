import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from './Button';
import { cx } from './util';
/** Запись сочетания клавиш в виде кнопки. Только вид и состояния: сами клавиши слушает приложение
 *  и передаёт сюда keys / recording / invalid. Очистка — отдельной IconButton рядом. */
export function HotkeyButton({ keys = [], recording = false, invalid = false, emptyLabel = 'Set…', setLabel = 'Change', recordingLabel = 'Press keys…', invalidLabel = 'Taken', size, className, ...rest }) {
    const has = keys.length > 0;
    if (recording)
        return _jsx(Button, { size: size, variant: "primary", "data-recording": "", className: cx('bw-hotkey', className), ...rest, children: recordingLabel });
    if (invalid)
        return _jsx(Button, { size: size, variant: "danger-outline", keys: keys, className: cx('bw-hotkey', className), ...rest, children: invalidLabel });
    return _jsx(Button, { size: size, keys: has ? keys : undefined, className: cx('bw-hotkey', className), ...rest, children: has ? setLabel : emptyLabel });
}
//# sourceMappingURL=HotkeyButton.js.map