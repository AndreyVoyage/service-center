'use client';

import { ContactFormData } from '@/lib/api';
import RequestForm from './RequestForm';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  data: ContactFormData;
  equipmentTypes?: string[];
}

// Маппинг иконок
const iconMap: Record<string, string> = {
  check: '✓',
  star: '★',
  shield: '🛡',
  clock: '🕐',
  phone: '📞',
  tool: '🔧',
};

// Fallback данные для leftBlock
const defaultLeftBlock = {
  title: 'Оставить заявку',
  description: 'Заполните форму, и мы перезвоним вам в течение 15 минут для уточнения деталей и согласования времени выезда мастера.',
  features: [
    { icon: 'check', text: 'Бесплатная диагностика при ремонте' },
    { icon: 'check', text: 'Прозрачное ценообразование' },
    { icon: 'check', text: 'Официальный договор' },
  ],
};

// Fallback для equipmentTypes
const defaultEquipmentTypes = [
  'Промышленный холодильник',
  'Морозильная камера',
  'Холодильная витрина',
  'Ларь морозильный',
  'Кондитерский шкаф',
  'Холодильный агрегат',
];

export default function ContactSection({ data, equipmentTypes = defaultEquipmentTypes }: ContactSectionProps) {
  // Используем leftBlock из CMS или fallback
  const leftBlock = data.leftBlock || defaultLeftBlock;
  
  return (
    // BEM: Блок contact-section
    <section id="form" className={styles['contact-section']}>
      {/* BEM: Элемент container */}
      <div className={styles['contact-section__container']}>
        
        {/* === ЛЕВЫЙ БЛОК === */}
        {/* BEM: Элемент left */}
        <div className={styles['contact-section__left']}>
          {/* BEM: Элемент title */}
          <h2 className={styles['contact-section__title']}>
            {leftBlock.title}
          </h2>
          
          {/* BEM: Элемент description */}
          <p className={styles['contact-section__description']}>
            {leftBlock.description}
          </p>
          
          {/* BEM: Элемент features */}
          <ul className={styles['contact-section__features']}>
            {leftBlock.features?.map((feature, index) => (
              // BEM: Элемент feature
              <li 
                key={index}
                className={styles['contact-section__feature']}
              >
                {/* BEM: Элемент icon + модификатор */}
                <span 
                  className={`
                    ${styles['contact-section__icon']}
                    ${styles[`contact-section__icon--${feature.icon}`]}
                  `}
                >
                  {iconMap[feature.icon] || '✓'}
                </span>
                {/* BEM: Элемент text */}
                <span className={styles['contact-section__feature-text']}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* === ПРАВЫЙ БЛОК (ФОРМА) === */}
        {/* BEM: Элемент right */}
        <div className={styles['contact-section__right']}>
          {/* BEM: Элемент form-wrapper */}
          <div className={styles['contact-section__form-wrapper']}>
            <RequestForm cmsConfig={data} equipmentTypes={equipmentTypes} />
          </div>
        </div>
        
      </div>
    </section>
  );
}
