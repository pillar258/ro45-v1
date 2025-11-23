import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import SignupForm from '../../../components/auth/SignupForm'

export default async function SignupPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{dict.pages.signup}</h1>
      <SignupForm locale={params.locale} />
    </div>
  )
}