import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n'

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)
  const p = dict.about_page

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">{p.title}</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">{p.description}</p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">{p.core_principles}</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{p.vision_title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{p.vision_text}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{p.mission_title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{p.mission_text}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{p.values_title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{p.values_text}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">{p.team_title}</h2>
        <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-400">{p.team_subtitle}</p>
        {/* Team members will be added here later */}
      </section>
    </div>
  )
}
