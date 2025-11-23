export default function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-950">
      <p className="text-sm">“{quote}”</p>
      <div className="text-xs text-gray-600 mt-2">— {author}</div>
    </div>
  )
}