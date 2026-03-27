import { RootPage } from '@payloadcms/next/views'
import config from '../../../../payload.config'  // ← относительный путь

export default function AdminPage(props: any) {
  return <RootPage config={config} {...props} />
}