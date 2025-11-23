"use client"
import type { Locale } from '../../../../i18n'
import { useEffect, useState } from 'react'
import { createClient } from '../../../../utils/supabase/client'
import Link from 'next/link'

type RegItem = { id: string; event_id: string }
type EventItem = { id: string; title: string; date?: string; location?: string }
type Item = { regId: string; event: EventItem }

export default function MyEventsPage({ params }: { params: { locale: Locale } }) {
  const l = params.locale
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { data: u } = await supabase.auth.getUser()
      const userId = u.user?.id
      if (!userId) return
      const { data: regs } = await supabase.from('event_registrations').select('id,event_id').eq('user_id', userId)
      const ids = (regs ?? []).map((r: RegItem) => r.event_id)
      if (ids.length===0) { setItems([]); return }
      const { data: events } = await supabase.from('events').select('id,title,date,location').in('id', ids)
      const eventMap = new Map<string, EventItem>()
      ;(events ?? []).forEach((e: any) => eventMap.set(e.id, e))
      const merged: Item[] = (regs ?? []).map((r: RegItem) => ({ regId: r.id, event: eventMap.get(r.event_id) as EventItem })).filter(x=>x.event)
      setItems(merged)
    }
    run()
  }, [])
  return (
    <div className="grid gap-3">
      <h1 className="text-xl font-semibold">{l==='zh'?'我的活动':'My Events'}</h1>
      <ul className="grid gap-2">
        {items.map(it => (
          <li key={it.event.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.event.title}</div>
              <div className="text-sm text-gray-600">{it.event.date || ''} {it.event.location || ''}</div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/${l}/events/${it.event.id}`} className="text-brand-700 text-sm">{l==='zh'?'详情':'Detail'}</Link>
              <button className="text-red-600 text-sm" onClick={async()=>{
                const supabase = createClient()
                await supabase.from('event_registrations').delete().eq('id', it.regId)
                location.reload()
              }}>{l==='zh'?'取消报名':'Cancel'}</button>
            </div>
          </li>
        ))}
        {items.length===0 && <div className="text-sm text-gray-600">{l==='zh'?'暂无报名':'No registrations'}</div>}
      </ul>
    </div>
  )
}