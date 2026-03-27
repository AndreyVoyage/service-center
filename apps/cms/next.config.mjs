import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@payloadcms/next', '@payloadcms/db-postgres', '@payloadcms/richtext-lexical'],
  webpack: (config, { isServer }) => {
    // Разрешаем алиасы явно
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
      '@': path.resolve(__dirname, 'src'),
    }
    
    // Для серверных компонентов тоже
    if (isServer) {
      config.resolve.alias['@payload-config'] = path.resolve(__dirname, 'src/payload.config.ts')
    }
    
    return config
  },
}

export default withPayload(nextConfig)