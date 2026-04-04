import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false })

export async function sendTelegram(text: string): Promise<void> {
  await bot.sendMessage(process.env.TELEGRAM_CHAT_ID!, text, { parse_mode: 'HTML' })
}

// Отправка уведомления о форме с поддержкой кастомного chatId
export async function sendFormNotification(
  text: string,
  chatId?: string
): Promise<void> {
  const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID
  if (!targetChatId) {
    console.warn('Telegram chat ID not configured')
    return
  }
  
  // Экранирование спецсимволов для MarkdownV2/HTML
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  await bot.sendMessage(targetChatId, escapedText, { parse_mode: 'HTML' })
}
