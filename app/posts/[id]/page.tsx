type Props = { params: { id: string } }

export default function PostDetailPage({ params }: Props) {
  const { id } = params
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">文章详情 #{id}</h1>
      <p>原型页。后续将接入内容、评论与分享功能。</p>
    </div>
  )
}