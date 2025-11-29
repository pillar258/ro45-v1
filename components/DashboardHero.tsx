'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShieldCheck, User, GraduationCap, Building } from 'lucide-react'

const icons = {
  ShieldCheck,
  UserTie: User, 
  GraduationCap,
  Building,
}

export default function DashboardHero({ slides }: { slides: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides])

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[activeIndex]
  const IconComponent = currentSlide.icon_name ? (icons as any)[currentSlide.icon_name] : null

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] text-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentSlide.image}
          alt={currentSlide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {IconComponent && <IconComponent className="w-16 h-16 mb-4 text-white/80" />}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{currentSlide.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">{currentSlide.description}</p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${activeIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
          />
        ))}
      </div>
    </section>
  )
}
