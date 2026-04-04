/* apps/cms/src/blocks/index.ts */

// ✅ Импорты
import { Hero } from './Hero'
import { ServicesGrid } from './ServicesGrid'
import { ReviewsSlider } from './ReviewsSlider'
import { FormBuilder } from './FormBuilder'
import { Block } from 'payload'

// ✅ Экспорты
export { Hero }
export { ServicesGrid }
export { ReviewsSlider }
export { FormBuilder }

// ✅ Массив блоков для страниц
export const pageBlocks: Block[] = [Hero, ServicesGrid, ReviewsSlider, FormBuilder]
