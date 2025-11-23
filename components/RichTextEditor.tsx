"use client"
import { useEffect, useRef } from 'react'

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.innerHTML !== value) el.innerHTML = value || ''
  }, [value])
  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    const el = ref.current
    if (el) onChange(el.innerHTML)
  }
  const addLink = () => {
    const url = prompt('Link URL') || ''
    if (url) exec('createLink', url)
  }
  const addImage = () => {
    const url = prompt('Image URL') || ''
    if (url) exec('insertImage', url)
  }
  const clear = () => {
    const el = ref.current
    if (el) { el.innerHTML = ''; onChange('') }
  }
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('bold')}>B</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('italic')}>I</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('underline')}>U</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('formatBlock', 'H1')}>H1</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('formatBlock', 'H2')}>H2</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={addLink}>Link</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={addImage}>Image</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={clear}>Clear</button>
      </div>
      <div
        ref={ref}
        className="min-h-[160px] border rounded p-3 focus:outline-none"
        contentEditable
        onInput={e => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  )
}