/* apps/cms/src/blocks/index.ts */

// ✅ Сначала импортируем
import { Hero } from './Hero'
import { ServicesGrid } from './ServicesGrid'
import { Block } from 'payload'
import { ReviewsSlider } from './ReviewsSlider' 

// ✅ Потом экспортируем
export { Hero }
export { ServicesGrid }
export { ReviewsSlider } from './ReviewsSlider'

// ✅ Используем
export const pageBlocks: Block[] = [Hero, ServicesGrid, ReviewsSlider]