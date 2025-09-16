import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false })

export async function sendTelegram(text: string): Promise<void> {
  await bot.sendMessage(process.env.TELEGRAM_CHAT_ID!, text, { parse_mode: 'HTML' })
}