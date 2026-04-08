'use client'

import React from 'react'

export const CategorySelectInfo: React.FC = () => {
  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '6px',
        marginBottom: '16px',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '14px',
          color: '#1e40af',
          lineHeight: '1.5',
        }}
      >
        <strong>Автоматическая подгрузка категорий</strong>
        <br />
        Опции для этого поля будут загружены автоматически из раздела{' '}
        <a
          href="/admin/collections/categories"
          style={{
            color: '#2563eb',
            textDecoration: 'underline',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Категории
        </a>
        .
        <br />
        Управляйте списком категорий в соответствующем разделе админки.
      </p>
    </div>
  )
}
