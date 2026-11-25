// Вход `@bedware/ui/vim-form`: клавиатурная навигация по формам настроек, как в Vim.
// Отдельный вход, чтобы приложения, которым она не нужна, её код не тянули.
// Вид (кольцо курсора, метки, таблица клавиш) — в общем `@bedware/ui/styles.css`.
export { SEQUENCE_JOIN, MAX_COUNT, KeySequencer, keyTokenFromEvent, isCtrlToken, matchKeys, timesFor, runTimes, parseKeySequence, formatKeySequence, displayKeySequence, bindKeys, keysFor, vimKeyCaps, vimKeyCapsAll, LEAVE_INSERT_CAP, } from './keys';
export { DEFAULT_VIM_FORM_BINDINGS, DEFAULT_VIM_FORM_KEYMAP, VIM_FORM_COMMAND_LABELS, createVimKeymap, vimFormKeymap, vimFormCommandsInOrder, } from './keymap';
export { VIM_FORM_REPEATABLE, VIM_FORM_COUNTABLE, useVimFormMode, usePopupVimMode, useKeySequence, isTypingElement, isEscapeKey, isCopyKey, isLeaveInsertKey, } from './mode';
export { hintAlphabet, hintLabels, withHints, hintIndex, useVimFormHints, usePopupHints } from './hints';
export { VimFormController, VimFormContext, useVimForm, useVimFormSnapshot, useVimFormLabelCount, setItemStepper, inferItemKind, stepIndex, stepRangeValue, nearestCell, } from './form';
export { useVimFormKeys } from './useVimFormKeys';
export { VimFormLabels, VimFormCursorHints, VimFormHintBar, VimFormKeysHelp, KeysHelp, VIM_FORM_TEXTS, } from './VimForm';
export { VimSelect } from './VimSelect';
//# sourceMappingURL=index.js.map