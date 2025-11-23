import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="bg-brand-50">
      <div className="container py-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-800">RO149 · 开放的行业社区与发布平台</h1>
          <p className="mt-2 text-gray-700">会员发布 · 社区展示 · 教育与活动 · 即时公开浏览</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-brand-600 text-white rounded">Learn More</button>
          </div>
        </div>
        <div className="relative h-48 sm:h-64 md:h-72">
          <Image
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop"
            alt="Conference"
            fill
            className="object-cover rounded"
            priority
          />
        </div>
      </div>
    </section>
  )
}