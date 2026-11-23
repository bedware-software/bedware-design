Выпадающее и контекстное меню: заголовок группы, пункты со значками и клавишами, разделители.
React: `<Menu>`, `<MenuHeader>`, `<MenuItem icon keys selected danger disabled>`, `<MenuSeparator>`.

- Меню — фон `surface-2`, рамка `border-strong`, скругление `radius-lg`, текст 12px, тень `shadow-popover`.
- Заголовок — моноширинный 10px заглавными, `text-muted`.
- Пункт — hover `surface-3`; выбранный с клавиатуры — `selected`: фон `surface-4` и полоса `plate` 3px слева.
- Опасный пункт — `danger`, цвет `error`; недоступный — `disabled`, цвет `text-dim`.
- Клавиши справа — каждая своей шапкой. Клавиатурой управляет тот, кто открыл меню.
