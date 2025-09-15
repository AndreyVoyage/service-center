import express from 'express'
import { getPayload } from 'payload'
import config from './payload.config'

const app = express()
const PORT = process.env.PORT || 3001

async function start(): Promise<void> {
  // 1. инициализируем Payload, НО передаём НАШ express
  await getPayload({ config, express: app })

  // 2. админ-роуты уже замаунтины автоматически на /admin
  //    (можно добавить свои после)

  app.listen(PORT, () => {
    console.log(`CMS ready → http://localhost:${PORT}/admin`)
  })
}

void start()
export default app