import AdminNav from '../../../components/AdminNav'
import type { Locale } from '../../../i18n'

export default function AdminLayout({ children, params }: { children: React.ReactNode, params: { locale: Locale } }) {
  return (
    <section>
      <AdminNav locale={params.locale} />
      <div className="container py-6">{children}</div>
    </section>
  )
}