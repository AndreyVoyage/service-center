/*  ReviewsSlider.ts  –– слайдер отзывов */
import { Block } from 'payload'

export const ReviewsSlider: Block = {
  slug: 'reviewsSlider',
  labels: { singular: 'Reviews Slider', plural: 'Reviews Sliders' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true
    },
    {
      name: 'filter',
      type: 'select',
      options: [
        { label: 'All published', value: 'all' },
        { label: 'Only 5 stars', value: '5' },
        { label: '4+ stars', value: '4plus' }
      ],
      defaultValue: 'all'
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 50,
      defaultValue: 9
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true
    }
  ]
}