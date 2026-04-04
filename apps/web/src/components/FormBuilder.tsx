'use client'

import { useState, FormEvent, useCallback } from 'react'
import { submitFormBuilder, FormFieldConfig, FormBuilderBlock } from '@/lib/api'
import styles from './FormBuilder.module.css'

interface FormBuilderProps {
  block: FormBuilderBlock
  pageSlug: string
}

export default function FormBuilderComponent({ block, pageSlug }: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Фильтруем только включенные поля
  const enabledFields = block.fields?.filter(f => f.isEnabled !== false) || []

  // Сортируем по порядку (если есть)
  const sortedFields = [...enabledFields]

  const handleChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }))
    // Очищаем ошибку при изменении
    if (errors[label]) {
      setErrors(prev => ({ ...prev, [label]: '' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Клиентская валидация
    const newErrors: Record<string, string> = {}
    for (const field of sortedFields) {
      const value = formData[field.label] || ''
      if (field.isRequired && !value.trim()) {
        newErrors[field.label] = `Поле "${field.label}" обязательно для заполнения`
      }
      if (value && field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern)
        if (!regex.test(value)) {
          newErrors[field.label] = field.validation.errorMessage || 'Некорректный формат'
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    // Отправка
    const result = await submitFormBuilder(pageSlug, block.id, formData)
    
    if (result.success) {
      setIsSuccess(true)
      setFormData({})
    } else if (result.errors) {
      setErrors(result.errors)
    }
    
    setIsSubmitting(false)
  }

  const renderField = (field: FormFieldConfig) => {
    const value = formData[field.label] || field.defaultValue || ''
    const error = errors[field.label]
    const inputType = getInputType(field)

    const commonProps = {
      id: field.label,
      name: field.label,
      placeholder: field.placeholder,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleChange(field.label, e.target.value),
      required: field.isRequired,
      className: `${styles.input} ${error ? styles.error : ''}`,
    }

    return (
      <div 
        key={field.label} 
        className={`${styles.field} ${styles[`field${capitalize(field.width)}`]}`}
      >
        <label htmlFor={field.label} className={styles.label}>
          {field.label}
          {field.isRequired && <span className={styles.required}> *</span>}
        </label>

        {inputType === 'textarea' ? (
          <textarea {...commonProps} rows={4} />
        ) : inputType === 'select' ? (
          <select {...commonProps}>
            <option value="">{field.placeholder || 'Выберите...'}</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : inputType === 'checkbox' ? (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={(e) => handleChange(field.label, e.target.checked ? 'true' : '')}
              className={styles.checkbox}
            />
            {field.placeholder || field.label}
          </label>
        ) : (
          <input {...commonProps} type={inputType} />
        )}

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h3>Спасибо!</h3>
        <p>{block.successMessage || 'Мы свяжемся с вами в ближайшее время.'}</p>
      </div>
    )
  }

  return (
    <div className={styles.formContainer}>
      {block.title && <h3 className={styles.title}>{block.title}</h3>}
      {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Honeypot поле (скрытое) */}
        {block.spamProtection?.honeypot && (
          <div style={{ display: 'none' }}>
            <input
              type="text"
              name={block.spamProtection.honeypot}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}

        <div className={styles.formGrid}>
          {sortedFields.map(renderField)}
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : (block.submitButtonText || 'Отправить')}
        </button>
      </form>
    </div>
  )
}

// Хелперы
function getInputType(field: FormFieldConfig): string {
  if (field.fieldType === 'custom' && field.customType) {
    return field.customType
  }
  switch (field.fieldType) {
    case 'email': return 'email'
    case 'phone': return 'tel'
    case 'message': return 'textarea'
    default: return 'text'
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
