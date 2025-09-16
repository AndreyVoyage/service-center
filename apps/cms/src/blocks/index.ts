/* apps/cms/src/blocks/index.ts */

// ✅ Сначала импортируем
import { Hero } from './Hero'
import { ServicesGrid } from './ServicesGrid'
import { Block } from 'payload'

// ✅ Потом экспортируем
export { Hero }
export { ServicesGrid }

// ✅ Используем
export const pageBlocks: Block[] = [Hero, ServicesGrid]