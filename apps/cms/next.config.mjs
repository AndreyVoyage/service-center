import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Отключаем для экономии памяти
  transpilePackages: ['@payloadcms/next', '@payloadcms/db-postgres', '@payloadcms/richtext-lexical'],
  
  // Отключаем статический анализ для экономии памяти
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  webpack: (config, { isServer, dev }) => {
    // Отключаем кэш Webpack для экономии памяти
    config.cache = false
    
    // Разрешаем алиасы
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
      '@': path.resolve(__dirname, 'src'),
    }
    
    // Для серверных компонентов
    if (isServer) {
      config.resolve.alias['@payload-config'] = path.resolve(__dirname, 'src/payload.config.ts')
    }
    
    // Лимитируем параллельность
    config.parallelism = 2
    
    return config
  },
  
  // Кэширование API
  async headers() {
    return [
      {
        source: '/api/globals/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
