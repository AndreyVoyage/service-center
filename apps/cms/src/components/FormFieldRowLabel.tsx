'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

// Иконки для типов полей
const fieldTypeIcons: Record<string, string> = {
  name: '👤',
  phone: '📞',
  email: '✉️',
  message: '💬',
  text: '📝',
  select: '📋',
  checkbox: '☑️',
  categorySelect: '📁',
  custom: '🔧',
}

// Названия на русском
const fieldTypeLabels: Record<string, string> = {
  name: 'Имя',
  phone: 'Телефон',
  email: 'Email',
  message: 'Сообщение',
  text: 'Текст',
  select: 'Список (ручной)',
  checkbox: 'Чекбокс',
  categorySelect: 'Категории (авто)',
  custom: 'Кастомное',
}

export const FormFieldRowLabel: React.FC<{ path: string; index: number }> = ({
  path,
  index,
}) => {
  // Получаем данные текущей строки
  const rowData = useFormFields(([fields]) => {
    const fieldPath = `${path}.${index}`
    const fieldType = fields[`${fieldPath}.fieldType`]?.value as string
    const label = fields[`${fieldPath}.label`]?.value as string
    const isEnabled = fields[`${fieldPath}.isEnabled`]?.value as boolean

    return {
      fieldType: fieldType || 'name',
      label: label || 'Без названия',
      isEnabled: isEnabled !== false,
    }
  })

  const { fieldType, label, isEnabled } = rowData

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        background: isEnabled ? '#f8fafc' : '#f1f5f9',
        borderRadius: '6px',
        border: `2px solid ${isEnabled ? '#e2e8f0' : '#cbd5e1'}`,
        opacity: isEnabled ? 1 : 0.6,
      }}
    >
      {/* Иконка типа поля */}
      <span style={{ fontSize: '20px' }}>{fieldTypeIcons[fieldType] || '🔧'}</span>

      {/* Название поля */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            color: isEnabled ? '#1e293b' : '#64748b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {fieldTypeLabels[fieldType] || fieldType}
          {!isEnabled && ' • Выключено'}
        </div>
      </div>
    </div>
  )
}
