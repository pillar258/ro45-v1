import Image from 'next/image'
import { cn } from '../lib/utils'

type Props = {
  title: string
  desc: string
  imageSrc: string
  Icon?: React.ElementType
}

export default function FeatureCard({ title, desc, imageSrc, Icon }: Props) {
  return (
    <div className={cn('border rounded overflow-hidden transition hover:shadow-md hover:-translate-y-0.5')}> 
      <div className="relative h-40">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 grid gap-2">
        <div className="flex items-center gap-2 text-brand-700 font-medium">
          {Icon ? <Icon className="w-4 h-4" /> : null}
          {title}
        </div>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}