import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '../../payload.config'
import { importMap } from './admin/importMap'

// Пробуем передать serverFunction как undefined или создать заглушку
const serverFunction = async () => {
  return {}
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout 
      config={config} 
      importMap={importMap}
      serverFunction={serverFunction as any}
    >
      {children}
    </RootLayout>
  )
}