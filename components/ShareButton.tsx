"use client"
import { Share2, Copy } from 'lucide-react'
import { Button } from './ui/button'

export default function ShareButton({ title }: { title: string }) {
  const onShare = async () => {
    const url = location.href
    if (navigator.share) {
      try { await navigator.share({ title, url }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied')
    } catch {}
  }
  return (
    <Button variant="outline" onClick={onShare}><Share2 className="w-4 h-4 mr-2" />Share</Button>
  )
}