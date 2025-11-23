import Link from 'next/link'

type Crumb = { href: string; label: string }

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-gray-600 mb-3">
      {items.map((c, i) => (
        <span key={c.href}>
          <Link href={c.href} className="hover:text-brand-600">{c.label}</Link>
          {i < items.length - 1 ? <span className="mx-2">/</span> : null}
        </span>
      ))}
    </nav>
  )
}