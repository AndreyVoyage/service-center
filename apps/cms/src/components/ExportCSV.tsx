'use client'

import { Button } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'

export const ExportCSV: React.FC = () => {
  const { data } = useListQuery()

  const handleExport = () => {
    if (!data?.docs?.length) return // защита от пустого списка

    const headers = Object.keys(data.docs[0]).join(',')
    const rows = data.docs.map((doc: any) =>
      Object.values(doc)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' })

    // нативная загрузка без @payloadcms/ui/shared
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.docs[0].collection ?? 'data'}-export.csv`
    document.body.appendChild(a) // Firefox требует DOM-узел
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return <Button onClick={handleExport}>Export CSV</Button>
}