export default function PartnersStrip({ dict }: { dict: any }) {
  const items = ['Partner A', 'Partner B', 'Partner C', 'Partner D', 'Partner E', 'Partner F']
  return (
    <section className="container py-6">
      <h2 className="text-xl font-semibold mb-4">{dict.title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((name) => (
          <div key={name} className="h-16 rounded border grid place-items-center bg-gray-50 dark:bg-gray-900 text-sm text-gray-600">
            {name}
          </div>
        ))}
      </div>
    </section>
  )
}
