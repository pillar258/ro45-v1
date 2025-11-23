import Link from 'next/link'

const mockPosts = [
  { id: '1', title: '示例文章一', excerpt: '这是一个占位文章摘要。' },
  { id: '2', title: '示例文章二', excerpt: '占位摘要，用于原型演示。' }
]

export default function PostsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">文章</h1>
      <ul className="grid gap-3">
        {mockPosts.map(p => (
          <li key={p.id} className="border rounded p-4">
            <Link href={`/posts/${p.id}`} className="font-medium text-brand-700">{p.title}</Link>
            <p className="text-sm text-gray-600 mt-1">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}