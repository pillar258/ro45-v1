type Props = { title: string; children?: React.ReactNode }
export default function Section({ title, children }: Props) {
  return (
    <section className="container py-8 animate-in fade-in-50">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </section>
  )
}