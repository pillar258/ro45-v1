import type { Locale } from '../../../../i18n'
import Image from 'next/image'
import { Button } from '../../../../components/ui/button'
import EventRegisterForm from '../../../../components/EventRegisterForm'
import ShareButton from '../../../../components/ShareButton'
import { getEventById } from '../../../../lib/provider'

export default async function EventDetail({ params }: { params: { locale: Locale, id: string } }) {
  const zh = params.locale==='zh'
  const event = await getEventById(params.id)
  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="relative h-56 md:h-72 rounded overflow-hidden">
        {event?.image ? (
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </div>
      <div className="grid gap-3">
        <h1 className="text-xl font-semibold">{event?.title ?? (zh?'活动':'Event')}</h1>
        {event?.date && <div className="text-sm text-gray-600">{zh?'日期':'Date'}: {event.date}</div>}
        {event?.location && <div className="text-sm text-gray-600">{zh?'地点':'Location'}: {event.location}</div>}
        <p className="text-sm">{zh?'活动介绍占位。后续将接入报名功能与议程详情。':'Event description placeholder. Registration and agenda will be integrated.'}</p>
        <div className="flex gap-2"><ShareButton title={event?.title ?? (zh?'活动':'Event')} /></div>
        <div className="mt-4"><EventRegisterForm locale={params.locale} eventId={params.id} /></div>
      </div>
    </div>
  )
}