import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import LoginForm from '../../../components/auth/LoginForm'
import AuthDebugger from '../../../components/auth/AuthDebugger'


export default async function LoginPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-4">{dict.pages.login}</h1>
        <LoginForm locale={params.locale} />
      </div>

    </div>
  )
}