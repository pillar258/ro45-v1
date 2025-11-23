"use client"
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import type { Locale } from '@/i18n'

export default function SignupForm({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  // 检查当前登录状态
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setCurrentUser(session.user.email)
      }
    })
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setCurrentUser(session.user.email)
      } else {
        setCurrentUser(null)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const onSubmit = async () => {
    setError('')
    setSuccess(false)
    
    // 输入验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setError(locale==='zh'?'请输入邮箱地址':'Please enter email address')
      return
    }
    if (!emailRegex.test(email.trim())) {
      setError(locale==='zh'?'请输入有效的邮箱地址':'Please enter a valid email address')
      return
    }
    
    if (!password.trim()) {
      setError(locale==='zh'?'请输入密码':'Please enter password')
      return
    }
    if (password.length < 6) {
      setError(locale==='zh'?'密码长度至少6位':'Password must be at least 6 characters')
      return
    }
    if (password.length > 128) {
      setError(locale==='zh'?'密码长度不能超过128位':'Password must not exceed 128 characters')
      return
    }
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      // 使用 Supabase 的 signUp 方法，它会自动处理邮箱重复检查
      const { error, data } = await supabase.auth.signUp({ 
        email: email.trim().toLowerCase(), 
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/login`,
          data: {
            display_name: email.split('@')[0],
            created_at: new Date().toISOString()
          }
        }
      })
      
      if (error) {
        // 处理各种错误情况
        if (error.message.includes('User already registered')) {
          setError(locale==='zh'?'该邮箱已被注册，请直接登录或重置密码':'This email is already registered, please login or reset password')
        } else if (error.message.includes('Unable to validate email address')) {
          setError(locale==='zh'?'邮箱地址无效':'Invalid email address')
        } else {
          setError(error.message)
        }
        return
      }
      
      // 注册成功处理
      if (data.user) {
        setSuccess(true)
        setEmail('')
        setPassword('')
        
        // 创建用户资料记录
        try {
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            display_name: data.user.email?.split('@')[0] || 'User',
            role: 'member'
          })
        } catch (profileError) {
          // 忽略资料创建错误，不影响注册流程
          console.warn('Profile creation failed:', profileError)
        }
        
        // 显示成功信息，然后跳转
        setTimeout(() => {
          router.push(`/${locale}/verify-pending`)
        }, 2000)
        
      } else {
        // 这种情况通常不会发生，但作为保护
        setError(locale==='zh'?'注册失败，请稍后重试':'Registration failed, please try again later')
      }
      
    } catch (err) {
      console.error('Registration error:', err)
      setError(locale==='zh'?'注册过程中发生错误，请重试':'An error occurred during registration, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 max-w-md">
      {currentUser ? (
        <div className="grid gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 font-medium">
            {locale==='zh'?'✅ 当前已登录':'✅ Already logged in'}
          </div>
          <div className="text-sm text-green-700">
            {locale==='zh'?'当前账号：':'Current account:'} {currentUser}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              {locale==='zh'?'进入会员中心':'Go to Dashboard'}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                setCurrentUser(null)
                setEmail('')
                setPassword('')
              }}
            >
              {locale==='zh'?'退出登录':'Logout'}
            </Button>
          </div>
        </div>
      ) : success ? (
        <div className="grid gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 font-medium">
            {locale==='zh'?'🎉 注册成功！':'🎉 Registration successful!'}
          </div>
          <div className="text-sm text-green-700">
            {locale==='zh'?'验证邮件已发送到您的邮箱，请查收并点击验证链接完成注册。':'Verification email has been sent to your inbox. Please check and click the verification link to complete registration.'}
          </div>
          <div className="text-xs text-green-600">
            {locale==='zh'?'2秒后自动跳转到验证页面...':'Redirecting to verification page in 2 seconds...'}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => router.push(`/${locale}/verify-pending`)}
          >
            {locale==='zh'?'立即跳转':'Go Now'}
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {locale==='zh'?'创建新账号':'Create New Account'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {locale==='zh'?'注册后即可发布内容、参与活动和评论':'Register to post content, join events and comment'}
            </p>
          </div>
          
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale==='zh'?'邮箱地址':'Email Address'}
              </label>
              <Input 
                placeholder={locale==='zh'?'请输入邮箱地址':'Enter email address'} 
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                type="email"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {locale==='zh'?'我们将向您发送验证邮件':'We will send you a verification email'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale==='zh'?'密码':'Password'}
              </label>
              <Input 
                placeholder={locale==='zh'?'请输入密码（至少6位）':'Enter password (at least 6 characters)'} 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {locale==='zh'?'密码长度至少6位字符':'Password must be at least 6 characters long'}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={onSubmit} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                {locale==='zh'?'注册中...':'Signing up...'}
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                {locale==='zh'?'立即注册':'Sign Up Now'}
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
          
          <div className="text-center text-sm text-gray-600">
            {locale==='zh'?'已有账号？':'Already have an account?'}
            <Link 
              href={`/${locale}/login`}
              className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
            >
              {locale==='zh'?'立即登录':'Login Now'}
            </Link>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="font-medium text-gray-600">
                {locale==='zh'?'注册即表示您同意：':'By registering, you agree to:'}
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>{locale==='zh'?'接收验证邮件和系统通知':'Receive verification emails and system notifications'}</li>
                <li>{locale==='zh'?'遵守社区准则和使用条款':'Comply with community guidelines and terms of service'}</li>
                <li>{locale==='zh'?'保护账号安全，不分享密码':'Protect account security and do not share passwords'}</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
