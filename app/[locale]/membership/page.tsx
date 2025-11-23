import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import Image from 'next/image'
import FeatureCard from '../../../components/FeatureCard'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Users, ShieldCheck, Presentation, BarChart3, FileText, MessageSquare } from 'lucide-react'

export default async function MembershipPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  const zh = params.locale==='zh'
  return (
    <div className="grid gap-10">
      <section className="container grid md:grid-cols-2 gap-6 items-center">
        <div className="relative h-48 sm:h-64 md:h-72 rounded overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop" alt="Membership" fill className="object-cover" />
        </div>
        <div className="grid gap-3">
          <h1 className="text-2xl font-bold">{dict.pages.membership}</h1>
          <p className="text-sm text-gray-700">{zh?'成为会员以发布内容、参与活动、拓展行业交流，并获取基金教育资源。':'Become a member to publish, join events, expand networking and access education resources.'}</p>
          <div className="flex gap-2">
            <Link href={`/${params.locale}/signup`}><Button>{zh?'立即注册':'Join now'}</Button></Link>
            <Link href={`/${params.locale}/posts`}><Button variant="outline">{zh?'了解更多':'Learn more'}</Button></Link>
          </div>
        </div>
      </section>

      <section className="container">
        <h2 className="text-xl font-semibold mb-4">{zh?'会员权益':'Member Benefits'}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard title={zh?'行业交流':'Networking'} desc={zh?'与全球到区域的资管机构建立联系':'Connect with global to regional asset managers'} imageSrc="https://images.unsplash.com/photo-1518081461904-9ac3e28c0ed4?q=80&w=1600&auto=format&fit=crop" Icon={Users} />
          <FeatureCard title={zh?'合规与教育':'Compliance & Education'} desc={zh?'获取基金教育与合规实践资源':'Access fund education and compliance practices'} imageSrc="https://images.unsplash.com/photo-1556767576-cfba4a8c9d32?q=80&w=1600&auto=format&fit=crop" Icon={ShieldCheck} />
          <FeatureCard title={zh?'活动与展示':'Events & Exposure'} desc={zh?'参与年度大会、圆桌与工作坊等活动':'Join annual conferences, roundtables and workshops'} imageSrc="https://images.unsplash.com/photo-1475724017904-b712052c192a?q=80&w=1600&auto=format&fit=crop" Icon={Presentation} />
          <FeatureCard title={zh?'研究与数据':'Research & Data'} desc={zh?'了解零售基金与 MPF 的市场趋势':'Understand retail funds and MPF trends'} imageSrc="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600&auto=format&fit=crop" Icon={BarChart3} />
          <FeatureCard title={zh?'内容发布':'Content Publishing'} desc={zh?'在平台发布文章与观点':'Publish articles and insights'} imageSrc="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop" Icon={FileText} />
          <FeatureCard title={zh?'交流互动':'Community Interaction'} desc={zh?'评论、留言与分享行业观点':'Comment, guestbook and share perspectives'} imageSrc="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop" Icon={MessageSquare} />
        </div>
      </section>

      <section className="container">
        <h2 className="text-xl font-semibold mb-4">{zh?'成功案例':'Success Stories'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600">{zh?'某机构会员':'A corporate member'}</div>
            <div className="text-sm mt-1">{zh?'通过大会与圆桌活动提升品牌曝光与行业影响力。':'Gained exposure and influence via conferences and roundtables.'}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600">{zh?'某个人会员':'An individual member'}</div>
            <div className="text-sm mt-1">{zh?'通过发布研究与分享观点拓展职业机会。':'Expanded career opportunities via research publications and insights.'}</div>
          </div>
        </div>
      </section>

      <section className="container">
        <h2 className="text-xl font-semibold mb-4">{zh?'会员级别':'Membership Tiers'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="text-lg font-semibold">{zh?'个人会员':'Individual'}</div>
            <p className="text-sm text-gray-600 mt-1">{zh?'适合从业者与研究人员，提供发布、评论与活动参与。':'For professionals and researchers. Includes publishing, commenting and events.'}</p>
          </div>
          <div className="border rounded p-4">
            <div className="text-lg font-semibold">{zh?'机构会员':'Corporate'}</div>
            <p className="text-sm text-gray-600 mt-1">{zh?'适合资管机构，提供更高展示与活动权益。':'For asset management firms. Higher exposure and event benefits.'}</p>
          </div>
        </div>
      </section>

      <section className="container">
        <h2 className="text-xl font-semibold mb-4">{zh?'加入流程':'How to Join'}</h2>
        <ol className="grid sm:grid-cols-3 gap-4">
          <li className="border rounded p-4">
            <div className="font-medium">{zh?'注册账号':'Sign up'}</div>
            <div className="text-sm text-gray-600 mt-1">{zh?'填写邮箱并完成验证。':'Fill in email and verify.'}</div>
          </li>
          <li className="border rounded p-4">
            <div className="font-medium">{zh?'完善资料':'Complete profile'}</div>
            <div className="text-sm text-gray-600 mt-1">{zh?'设置显示名称与头像等。':'Set display name and avatar.'}</div>
          </li>
          <li className="border rounded p-4">
            <div className="font-medium">{zh?'开始发布':'Start publishing'}</div>
            <div className="text-sm text-gray-600 mt-1">{zh?'创建草稿并提交审核或直接发布。':'Create drafts and submit for review or publish.'}</div>
          </li>
        </ol>
      </section>

      <section className="container">
        <h2 className="text-xl font-semibold mb-4">{zh?'常见问题':'FAQ'}</h2>
        <div className="grid gap-3">
          <div>
            <div className="font-medium">{zh?'邮箱验证的作用？':'Why email verification?'}</div>
            <div className="text-sm text-gray-600">{zh?'确保账户安全与权限有效，未验证无法发布或评论。':'Ensures account security and valid permissions. Unverified cannot publish or comment.'}</div>
          </div>
          <div>
            <div className="font-medium">{zh?'是否需要审核？':'Is review required?'}</div>
            <div className="text-sm text-gray-600">{zh?'新会员首发默认需审核，管理员可调整策略。':'First posts require review by default. Admin can adjust policy.'}</div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="border rounded p-6 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xl font-semibold">{zh?'准备好加入？':'Ready to join?'}</div>
            <div className="text-sm text-gray-600 mt-1">{zh?'立即注册，开始发布与参与活动。':'Sign up now to publish and join events.'}</div>
          </div>
          <div className="flex gap-2 md:justify-end">
            <Link href={`/${params.locale}/signup`}><Button>{zh?'立即注册':'Sign up'}</Button></Link>
            <Link href={`/${params.locale}/contact`}><Button variant="outline">{zh?'联系咨询':'Contact us'}</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}