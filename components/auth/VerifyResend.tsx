"use client"
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabaseClient'

export default function VerifyResend({ locale }: { locale: 'zh' | 'en' }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  const handleResend = async () => {
    if (!isSupabaseConfigured()) {
      setError(locale==='zh'?'系统配置错误':'System configuration error')
      return
    }

    if (!email.trim()) {
      setError(locale==='zh'?'请输入邮箱地址':'Please enter email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError(locale==='zh'?'请输入有效的邮箱地址':'Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/login`,
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch (err) {
      setError(locale==='zh'?'发送失败，请重试':'Failed to send, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {locale==='zh'?'没有收到验证邮件？':'Didn\'t receive verification email?'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {locale==='zh'?'请输入您的邮箱地址，我们将重新发送验证邮件':
            'Please enter your email address and we will resend the verification email'}
        </p>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale==='zh'?'邮箱地址':'Email Address'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={locale==='zh'?'请输入注册时的邮箱地址':'Enter the email address you registered with'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <Button 
          onClick={handleResend}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              {locale==='zh'?'发送中...':'Sending...'}
            </>
          ) : (
            <>
              <span className="mr-2">📧</span>
              {locale==='zh'?'重新发送验证邮件':'Resend Verification Email'}
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div className="text-sm text-green-700">
                {locale==='zh'?'验证邮件已重新发送，请查收':'Verification email has been resent, please check your inbox'}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p className="mb-1">{locale==='zh'?'提示：':'Tip:'}</p>
          <ul className="text-left list-disc pl-4 space-y-0.5">
            <li>{locale==='zh'?'请检查垃圾邮件文件夹':'Please check your spam folder'}</li>
            <li>{locale==='zh'?'邮件发送可能有1-2分钟延迟':'Email delivery may take 1-2 minutes'}</li>
            <li>{locale==='zh'?'每个邮箱每天最多可发送5封验证邮件':'Each email can receive up to 5 verification emails per day'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}