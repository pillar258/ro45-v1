import { Button } from './ui/button'

export default function CTASection({ dict }: { dict: any }) {
  return (
    <section className="bg-brand-50 dark:bg-gray-900">
      <div className="container py-8 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-bold">{dict.title}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{dict.subtitle}</p>
        </div>
        <div className="flex gap-2 justify-end md:justify-start">
          <Button>{dict.signUp}</Button>
          <Button variant="outline">{dict.seeBenefits}</Button>
        </div>
      </div>
    </section>
  )
}
