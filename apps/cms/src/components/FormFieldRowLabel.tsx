'use client'

import React from 'react'
import { useFieldArray, useFormFields } from '@payloadcms/ui'
import type { FieldLabel } from 'payload'

// Иконки для типов полей
const fieldTypeIcons: Record<string, string> = {
  name: '👤',
  phone: '📞',
  email: '✉️',
  message: '💬',
  custom: '🔧',
}

// Названия на русском
const fieldTypeLabels: Record<string, string> = {
  name: 'Имя',
  phone: 'Телефон',
  email: 'Email',
  message: 'Сообщение',
  custom: 'Кастомное',
}

export const FormFieldRowLabel: React.FC<{ path: string; index: number }> = ({
  path,
  index,
}) => {
  const { moveRow, removeRow, totalRows } = useFieldArray()
  
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

  const handleMoveUp = () => {
    if (index > 0) {
      moveRow(index, index - 1)
    }
  }

  const handleMoveDown = () => {
    if (index < totalRows - 1) {
      moveRow(index, index + 1)
    }
  }

  const handleRemove = () => {
    removeRow(index)
  }

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

      {/* Кнопки управления */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Кнопка вверх */}
        <button
          type="button"
          onClick={handleMoveUp}
          disabled={index === 0}
          title="Переместить вверх"
          style={{
            padding: '4px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            background: index === 0 ? '#f1f5f9' : '#fff',
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            opacity: index === 0 ? 0.5 : 1,
            fontSize: '14px',
          }}
        >
          ↑
        </button>

        {/* Кнопка вниз */}
        <button
          type="button"
          onClick={handleMoveDown}
          disabled={index === totalRows - 1}
          title="Переместить вниз"
          style={{
            padding: '4px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            background: index === totalRows - 1 ? '#f1f5f9' : '#fff',
            cursor: index === totalRows - 1 ? 'not-allowed' : 'pointer',
            opacity: index === totalRows - 1 ? 0.5 : 1,
            fontSize: '14px',
          }}
        >
          ↓
        </button>

        {/* Кнопка удалить */}
        <button
          type="button"
          onClick={handleRemove}
          title="Удалить поле"
          style={{
            padding: '4px 8px',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            background: '#fff',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
