/* apps/cms/src/app/my-route/route.ts - Form Submit API */
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadInstance } from '@/lib/payload-singleton'
import { sendFormNotification } from '@/lib/telegram'
import { autoWarmup } from '@/lib/auto-warmup'

export const dynamic = 'force-dynamic'

// Авто-прогрев при первом импорте
autoWarmup().catch(console.error)

// Валидация данных формы
function validateField(
  value: string,
  fieldConfig: any,
): string | null {
  if (fieldConfig.isRequired && (!value || value.trim() === '')) {
    return `Поле "${fieldConfig.label}" обязательно для заполнения`
  }

  if (!value) return null

  if (fieldConfig.validation?.minLength && value.length < fieldConfig.validation.minLength) {
    return fieldConfig.validation.errorMessage || 
      `Минимальная длина — ${fieldConfig.validation.minLength} символов`
  }

  if (fieldConfig.validation?.maxLength && value.length > fieldConfig.validation.maxLength) {
    return fieldConfig.validation.errorMessage || 
      `Максимальная длина — ${fieldConfig.validation.maxLength} символов`
  }

  if (fieldConfig.validation?.pattern) {
    const regex = new RegExp(fieldConfig.validation.pattern)
    if (!regex.test(value)) {
      return fieldConfig.validation.errorMessage || 'Поле заполнено некорректно'
    }
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadInstance()
    const body = await req.json()

    const { pageSlug, blockId, formData, metadata = {} } = body

    if (!pageSlug || !blockId || !formData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pages = await payload.find({
      collection: 'pages',
      where: { slug: { equals: pageSlug } },
      depth: 2,
    })

    if (!pages.docs.length) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    const page = pages.docs[0]
    const layout = page.layout as any[] || []
    const formBlock = layout.find(
      (block) => block.blockType === 'formBuilder' && block.id === blockId
    )

    if (!formBlock) {
      return NextResponse.json(
        { success: false, error: 'Form block not found' },
        { status: 404 }
      )
    }

    // Honeypot check
    if (formBlock.spamProtection?.honeypot) {
      const honeypotValue = formData[formBlock.spamProtection.honeypot]
      if (honeypotValue) {
        console.log('🚫 Honeypot triggered, bot detected')
        return NextResponse.json({
          success: true,
          message: formBlock.successMessage || 'Спасибо!',
        })
      }
    }

    const enabledFields = (formBlock.fields || []).filter((f: any) => f.isEnabled !== false)

    // Валидация
    const errors: Record<string, string> = {}
    for (const field of enabledFields) {
      const value = formData[field.label] || ''
      const error = validateField(value, field)
      if (error) errors[field.label] = error
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // Сохранение в БД
    if (formBlock.notifications?.saveToDatabase !== false) {
      await payload.create({
        collection: 'form-submissions',
        data: {
          formType: 'formBuilder',
          sourcePage: page.id,
          sourceBlockId: blockId,
          formData,
          metadata: {
            ...metadata,
            submittedAt: new Date().toISOString(),
            userAgent: req.headers.get('user-agent') || '',
            ipAddress: req.headers.get('x-forwarded-for') || '',
          },
          status: 'new',
        },
      })
    }

    // Telegram
    if (formBlock.notifications?.sendToTelegram) {
      const template = formBlock.notifications.telegramTemplate ||
        '🔔 <b>Новая заявка</b>\n\n{{data}}'
      
      const dataString = Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')

      const message = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        if (key === 'data') return dataString
        return formData[key] || ''
      })

      const chatId = formBlock.notifications.telegramChatId || process.env.TELEGRAM_CHAT_ID
      if (chatId) {
        await sendFormNotification(message, chatId)
      }
    }

    return NextResponse.json({
      success: true,
      message: formBlock.successMessage || 'Спасибо! Мы свяжемся с вами.',
    })

  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
