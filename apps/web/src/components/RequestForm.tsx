// apps/web/src/components/RequestForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { submitForm, ContactFormData } from '@/lib/api';
import styles from './RequestForm.module.css';

interface RequestFormProps {
  preselectedService?: string;
  equipmentTypes?: string[];
  cmsConfig?: ContactFormData;
}

// Fallback конфигурация если CMS недоступен
const fallbackConfig: ContactFormData = {
  title: 'Оставить заявку',
  subtitle: 'Заполните форму и мы свяжемся с вами в ближайшее время',
  fields: [
    { fieldType: 'name', name: 'name', label: 'Ваше имя', placeholder: 'Иван Иванов', required: true, order: 1 },
    { fieldType: 'phone', name: 'phone', label: 'Телефон', placeholder: '+7 (999) 123-45-67', required: true, order: 2 },
    { fieldType: 'message', name: 'message', label: 'Описание проблемы', placeholder: 'Опишите неисправность...', required: false, order: 3 },
  ],
  submitButtonText: 'Вызвать мастера',
  successMessage: 'Спасибо! Мы перезвоним вам в ближайшее время.',
};

export default function RequestForm({ preselectedService, equipmentTypes = [], cmsConfig }: RequestFormProps) {
  // Используем конфигурацию из CMS или fallback
  const config = cmsConfig?.isActive !== false ? (cmsConfig || fallbackConfig) : null;
  
  // Сортируем поля по order
  const sortedFields = config?.fields?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  
  // Инициализируем formData на основе полей из CMS
  const initialFormData: Record<string, string> = {};
  sortedFields.forEach(field => {
    initialFormData[field.name] = '';
  });
  // Добавляем service и equipmentType если есть
  if (preselectedService) {
    initialFormData.service = preselectedService;
  }
  initialFormData.equipmentType = '';

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitForm({
        name: formData.name || '',
        phone: formData.phone || '',
        message: formData.message || '',
        service: formData.service || preselectedService || '',
        equipmentType: formData.equipmentType || '',
      });
      
      setIsSuccess(true);
      // Сбрасываем форму
      const resetData: Record<string, string> = {};
      sortedFields.forEach(field => {
        resetData[field.name] = '';
      });
      if (preselectedService) {
        resetData.service = preselectedService;
      }
      resetData.equipmentType = '';
      setFormData(resetData);
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError('Ошибка отправки. Попробуйте позже или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Если форма неактивна в CMS
  if (!config) {
    return (
      <div className={styles.inactive}>
        <p>Форма временно недоступна. Пожалуйста, свяжитесь с нами по телефону.</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Спасибо!</h3>
        <p>{config.successMessage || fallbackConfig.successMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {config.title && <h3 className={styles.formTitle}>{config.title}</h3>}
      {config.subtitle && <p className={styles.formSubtitle}>{config.subtitle}</p>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Рендерим поля из CMS */}
        {sortedFields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
              {field.required && <span className={styles.required}> *</span>}
            </label>
            
            {field.fieldType === 'message' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                rows={4}
                className={styles.textarea}
                placeholder={field.placeholder || ''}
              />
            ) : field.fieldType === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className={styles.select}
              >
                <option value="">{field.placeholder || 'Выберите...'}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.fieldType === 'checkbox' ? (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={formData[field.name] === 'true'}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      [field.name]: e.target.checked ? 'true' : '' 
                    }));
                  }}
                  required={field.required}
                  className={styles.checkbox}
                />
                {field.placeholder || field.label}
              </label>
            ) : (
              <input
                type={field.fieldType === 'email' ? 'email' : field.fieldType === 'phone' ? 'tel' : 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                pattern={field.fieldType === 'phone' ? '[\\+]?[0-9\s\-\(\)]+' : undefined}
                className={styles.input}
                placeholder={field.placeholder || ''}
              />
            )}
          </div>
        ))}

        {/* Оборудование (если переданы equipmentTypes) */}
        {equipmentTypes.length > 0 && (
          <div className={styles.field}>
            <label htmlFor="equipmentType" className={styles.label}>
              Тип оборудования
            </label>
            <select
              id="equipmentType"
              name="equipmentType"
              value={formData.equipmentType || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Выберите тип</option>
              {equipmentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {preselectedService && (
          <input type="hidden" name="service" value={formData.service || preselectedService} />
        )}

        {error && <div className={styles.error}>{error}</div>}

        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : (config.submitButtonText || fallbackConfig.submitButtonText)}
        </button>
      </form>
    </div>
  );
}
