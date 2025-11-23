"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { createClient } from '../../utils/supabase/client'

export default function LoginForm({ locale }: { locale: 'zh' | 'en' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const router = useRouter()
  
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
    if (!email.trim() || !password.trim()) {
      setError(locale==='zh'?'请填写邮箱和密码':'Please enter email and password')
      return
    }
    setLoading(true)
    const supabase = createClient()
    
    try {
      // 先检查是否已有活跃会话
      const { data: { session: existingSession } } = await supabase.auth.getSession()
      if (existingSession) {
        console.log('Found existing session, signing out first')
        await supabase.auth.signOut()
      }
      
      console.log('Attempting login with:', { email: email.trim() })
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: password.trim() 
      })
      
      console.log('Login response:', { error, data })
      
      if (error) {
        setLoading(false)
        console.error('Login error details:', error)
        
        // 更详细的错误信息
        let errorMessage = error.message
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = locale==='zh'?'邮箱或密码错误，请检查后重试':'Invalid email or password, please check and try again'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = locale==='zh'?'邮箱尚未验证，请先验证邮箱':'Email not verified, please verify your email first'
        } else if (error.message.includes('too many requests')) {
          errorMessage = locale==='zh'?'登录尝试过多，请稍后再试':'Too many login attempts, please try again later'
        }
        
        setError(errorMessage)
        return
      }
      
      const user = data.user
      console.log('Login successful, user data:', user)
      
      if (user && !user.email_confirmed_at) {
        console.log('User email not confirmed, redirecting to verification')
        router.push(`/${locale}/verify-pending`)
        return
      }
      
      // 验证登录是否成功
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session after login:', session)
      
      if (session) {
        console.log('Login successful, redirecting to dashboard')
        router.push(`/${locale}/dashboard`)
      } else {
        console.error('No session found after successful login')
        setError(locale==='zh'?'登录失败，请重试':'Login failed, please try again')
      }
      
    } catch (err) {
      console.error('Login exception:', err)
      setError(locale==='zh'?'登录出错，请重试':'Login error, please try again')
    } finally {
      setLoading(false)
    }
  }

  // 重置密码功能
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(locale==='zh'?'请先输入邮箱地址':'Please enter your email address first')
      return
    }
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/${locale}/login`,
      })
      
      if (error) {
        setError(error.message)
      } else {
        setError('')
        alert(locale==='zh'?`密码重置邮件已发送到 ${email}，请查收并重置密码`:`Password reset email sent to ${email}, please check and reset your password`)
      }
    } catch (err) {
      setError(locale==='zh'?'发送重置邮件失败':'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-3 max-w-md">
      {currentUser ? (
        <div className="grid gap-3">
          <div className="text-sm text-green-600">
            {locale==='zh'?'当前已登录：':'Currently logged in as:'} {currentUser}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard`)}>
              {locale==='zh'?'进入会员中心':'Go to Dashboard'}
            </Button>
            <Button variant="ghost" onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              setCurrentUser(null)
              setEmail('')
              setPassword('')
            }}>
              {locale==='zh'?'退出登录':'Logout'}
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            {locale==='zh'?'✅ 登录状态正常，可以正常使用系统':'✅ Login status normal, system ready to use'}
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            {locale==='zh'?'请输入邮箱和密码登录':'Please enter email and password to login'}
          </div>
          <Input placeholder={locale==='zh'?'邮箱':'Email'} value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder={locale==='zh'?'密码':'Password'} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button onClick={onSubmit} disabled={loading}>{loading ? (locale==='zh'?'登录中...':'Signing in...') : (locale==='zh'?'登录':'Login')}</Button>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              className="text-xs p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {locale==='zh'?'忘记密码？':'Forgot password?'}
            </Button>
            
            <Link 
              href={`/${locale}/signup`}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {locale==='zh'?'注册新账号':'Sign up'}
            </Link>
          </div>
          
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="text-xs text-gray-500 space-y-1">
            <div>{locale==='zh'?'💡 提示：如果登录遇到问题，请检查：':'💡 Tip: If login issues, please check:'}</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>{locale==='zh'?'邮箱是否已验证':'Email is verified'}</li>
              <li>{locale==='zh'?'密码是否正确':'Password is correct'}</li>
              <li>{locale==='zh'?'网络连接是否正常':'Network connection is normal'}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}