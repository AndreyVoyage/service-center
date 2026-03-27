/* apps/cms/src/lib/notifyManagers.ts */
import nodemailer from 'nodemailer'
import axios from 'axios'
import type { FormSubmission } from '@/payload-types'
import type { Payload } from 'payload'

export async function notifyManagers(
  doc: FormSubmission, 
  payload: Payload
): Promise<void> {
  const { formType, data } = doc
  const subject = `Новая заявка: ${formType}`
  const html = `
    <p><b>Тип:</b> ${formType}</p>
    <p><b>Данные:</b></p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `

  // Используем прямую типизацию без импорта NotificationsGlobal
  const settings = await payload.findGlobal({
    slug: 'notifications',
  })

  // Приводим тип к ожидаемой структуре
  const ch = (settings as any)?.channels

  /* 2️⃣ Email (если включено и заполнено) */
  if (ch?.email?.enabled && ch.email.smtpHost && ch.email.user && ch.email.pass && ch.email.recipient) {
    const transporter = nodemailer.createTransport({
      host: ch.email.smtpHost,
      port: ch.email.smtpPort ?? 587,
      secure: ch.email.secure ?? false,
      auth: { user: ch.email.user, pass: ch.email.pass }
    })
    await transporter.sendMail({
      from: ch.email.user,
      to: ch.email.recipient,
      subject,
      html
    })
    console.log('[notify] Email queued')
  }

  /* 3️⃣ Telegram (ТОЛЬКО если заполнены ВСЕ поля) */
  const tg = ch?.telegram
  if (tg?.enabled && tg.botToken?.trim() && tg.chatId?.trim()) {
    try {
      const msg = `📩 <b>${subject}</b>\n<code>${JSON.stringify(data, null, 2)}</code>`
      await axios.post(
        `https://api.telegram.org/bot${tg.botToken.trim()}/sendMessage`,
        { chat_id: tg.chatId.trim(), text: msg, parse_mode: 'HTML' }
      )
      console.log('[notify] Telegram sent')
    } catch (err: any) {
      console.warn('[notify] Telegram error:', err.message)
    }
  }

  /* 4️⃣ WhatsApp (заготовка) */
  if (ch?.whatsapp?.enabled) {
    // оставлено для будущей интеграции
  }
}