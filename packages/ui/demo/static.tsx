// Образцы в статичный HTML — для превью дизайн-системы (tools/build-design-system.mjs).
import { renderToStaticMarkup } from 'react-dom/server'
import { stories } from './stories'

export const previews = stories.map(({ Demo, ...meta }) => ({ ...meta, html: renderToStaticMarkup(<Demo />) }))
