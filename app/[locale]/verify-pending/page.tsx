import type { Locale } from '../../../i18n'
import { getDictionary } from '../../../lib/getDictionary'
import VerifyResend from '../../../components/auth/VerifyResend'
import Link from 'next/link'

export default async function VerifyPendingPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  const zh = params.locale === 'zh'
  
  return (
    <div className="max-w-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📧</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {zh ? '验证您的邮箱' : 'Verify Your Email'}
        </h1>
        <p className="text-gray-600">
          {zh ? '我们已向您的邮箱发送了验证邮件' : 'We have sent a verification email to your inbox'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {zh ? '查收验证邮件' : 'Check your email'}
              </h3>
              <p className="text-sm text-gray-600">
                {zh ? '请前往您的邮箱查收验证邮件，邮件标题通常包含"验证"或"Verify"字样' : 
                  'Please check your email for the verification message, usually with "Verify" in the subject line'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {zh ? '点击验证链接' : 'Click the verification link'}
              </h3>
              <p className="text-sm text-gray-600">
                {zh ? '在邮件中点击"验证邮箱"或"Verify Email"按钮完成验证' : 
                  'Click the "Verify Email" button in the email to complete verification'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {zh ? '开始使用' : 'Start using'}
              </h3>
              <p className="text-sm text-gray-600">
                {zh ? '验证完成后，您就可以发布内容、参与活动和评论了' : 
                  'Once verified, you can post content, join events and comment'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <span className="text-yellow-600 text-lg">⚠️</span>
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">
              {zh ? '注意事项' : 'Important Notes'}
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• {zh ? '验证邮件可能在垃圾邮件文件夹中' : 'Verification email may be in spam folder'}</li>
              <li>• {zh ? '邮件有效期为24小时，请及时验证' : 'Email expires in 24 hours, please verify promptly'}</li>
              <li>• {zh ? '如果未收到邮件，请检查邮箱地址是否正确' : 'If not received, check if email address is correct'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <VerifyResend locale={params.locale} />
        <div className="mt-4">
          <Link 
            href={`/${params.locale}/login`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {zh ? '← 返回登录页面' : '← Back to login page'}
          </Link>
        </div>
      </div>
    </div>
  )
}