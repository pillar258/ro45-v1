import type { Locale } from '../../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import Image from 'next/image'
import CommentsList from '../../../../components/CommentsList'
import CommentForm from '../../../../components/CommentForm'
import ShareButton from '../../../../components/ShareButton'
import Breadcrumb from '../../../../components/ui/breadcrumb'
import { getPostById } from '../../../../lib/provider'
export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = { params: { locale: Locale, id: string } }

export default async function PostDetailPage({ params }: Props) {
  const dict = await getDictionary(params.locale)
  const zh = params.locale==='zh'
  const post = await getPostById(params.id)
  return (
    <div className="grid gap-4">
      <Breadcrumb items={[{ href: `/${params.locale}/posts`, label: dict.pages.posts }, { href: `/${params.locale}/posts/${params.id}`, label: `${dict.pages.postDetail} #${params.id}` }]} />
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="relative h-56 md:h-72 rounded overflow-hidden">
          {post?.cover ? (
            <Image src={post.cover} alt={post.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gray-100" />
          )}
        </div>
        <div className="grid gap-2">
          <h1 className="text-xl font-semibold">{post?.title ?? (zh?'文章标题':'Post Title')}</h1>
          <div className="text-sm text-gray-600">{zh?'作者':'Author'}: {post?.author_name ?? 'member'} {post?.created_at ? `· ${post.created_at.slice(0,10)}` : ''}</div>
          {post?.excerpt && <p className="text-sm">{post.excerpt}</p>}
          {post?.content && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />}
          <div className="flex gap-2">
            <ShareButton title={post?.title ?? (zh?'文章标题':'Post Title')} />
          </div>
        </div>
      </div>
      <CommentsList locale={params.locale} postId={params.id} />
      <CommentForm locale={params.locale} postId={params.id} onSubmitted={() => window.location.reload()} />
    </div>
  )
}