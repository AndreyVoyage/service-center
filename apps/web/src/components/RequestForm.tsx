// apps/web/src/components/RequestForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { submitForm } from '@/lib/api';
import styles from './RequestForm.module.css';

interface RequestFormProps {
  preselectedService?: string;
  equipmentTypes?: string[];
}

export default function RequestForm({ preselectedService, equipmentTypes = [] }: RequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    service: preselectedService || '',
    equipmentType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitForm({
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        service: formData.service,
        equipmentType: formData.equipmentType,
      });
      
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        message: '',
        service: preselectedService || '',
        equipmentType: '',
      });
      
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

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Спасибо!</h3>
        <p>Мы перезвоним вам в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Ваше имя *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Иван Иванов"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Телефон *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="[\+]?[0-9\s\-\(\)]+"
          className={styles.input}
          placeholder="+7 (999) 123-45-67"
        />
      </div>

      {equipmentTypes.length > 0 && (
        <div className={styles.field}>
          <label htmlFor="equipmentType" className={styles.label}>
            Тип оборудования
          </label>
          <select
            id="equipmentType"
            name="equipmentType"
            value={formData.equipmentType}
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

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Описание проблемы
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={styles.textarea}
          placeholder="Опишите неисправность..."
        />
      </div>

      {preselectedService && (
        <input type="hidden" name="service" value={formData.service} />
      )}

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Отправка...' : 'Вызвать мастера'}
      </button>
    </form>
  );
}