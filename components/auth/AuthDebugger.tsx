"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function AuthDebugger({ locale: rawLocale }: { locale: 'zh' | 'en' | 'zh-HK' }) {
  const locale = rawLocale.startsWith('zh') ? 'zh' : 'en'
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const addDebugInfo = (info: string) => {
    // 使用函数式更新避免在渲染过程中直接修改状态
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${info}`])
  }
  
  // 使用useEffect来处理可能导致状态更新的操作
  useEffect(() => {
    // 这个effect用于清理或其他需要在组件挂载后执行的操作
    return () => {
      // 清理函数
    }
  }, [])
  
  const testAuth = async () => {
    setLoading(true)
    setDebugInfo([])
    
    // 收集所有调试信息到数组中，然后一次性设置状态
    const logs: string[] = []
    const addLog = (info: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${info}`)
    }
    
    try {
      addLog('=== 开始认证测试 ===')
      addLog(`测试邮箱: ${testEmail}`)
      addLog(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '已配置' : '未配置'}`)
      addLog(`Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已配置' : '未配置'}`)
      
      // 0. 检查浏览器环境
      addLog('=== 浏览器环境检查 ===')
      addLog(`用户代理: ${navigator.userAgent.substring(0, 50)}...`)
      addLog(`本地存储可用: ${typeof window !== 'undefined' && window.localStorage ? '是' : '否'}`)
      addLog(`Cookie启用: ${navigator.cookieEnabled ? '是' : '否'}`)
      
      // 检查本地存储中的认证数据
      if (typeof window !== 'undefined' && window.localStorage) {
        const supabaseData = window.localStorage.getItem('supabase.auth.token')
        addLog(`本地存储认证数据: ${supabaseData ? '存在' : '不存在'}`)
        if (supabaseData) {
          try {
            const parsed = JSON.parse(supabaseData)
            addLog(`存储的用户: ${parsed.user?.email || '未知'}`)
          } catch (e) {
            addLog('本地存储数据格式错误')
          }
        }
      }
      
      // 1. 检查当前会话
      addLog('=== 会话检查 ===')
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addLog(`会话错误: ${sessionError.message}`)
        addLog(`错误代码: ${sessionError.code || '无'}`)
      } else {
        addLog(`当前会话状态: ${currentSession ? '已登录' : '未登录'}`)
        if (currentSession) {
          addLog(`当前用户: ${currentSession.user.email}`)
          addLog(`用户ID: ${currentSession.user.id}`)
          addLog(`访问令牌过期: ${currentSession.expires_at ? new Date(currentSession.expires_at * 1000).toLocaleString() : '未知'}`)
        }
      }
      
      // 2. 尝试登录
      addLog('=== 登录测试 ===')
      addLog('尝试登录...')
      
      // 记录登录请求前的状态
      addLog(`登录请求时间: ${new Date().toLocaleTimeString()}`)
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })
      
      // 记录登录响应
      addLog(`登录响应时间: ${new Date().toLocaleTimeString()}`)
      
      if (loginError) {
        addLog(`登录失败: ${loginError.message}`)
        addLog(`错误代码: ${loginError.code || '无'}`)
        addLog(`错误状态: ${loginError.status || '无'}`)
        
        // 详细错误分析
        if (loginError.message.includes('Invalid login credentials')) {
          addLog('🔍 分析: 邮箱或密码不正确')
        } else if (loginError.message.includes('Email not confirmed')) {
          addLog('🔍 分析: 邮箱未验证')
        } else if (loginError.message.includes('too many requests')) {
          addLog('🔍 分析: 请求过于频繁')
        } else {
          addLog(`🔍 分析: 未知错误类型 - ${loginError.message}`)
        }
      } else {
        addLog('✅ 登录成功!')
        addLog(`用户ID: ${loginData.user.id}`)
        addLog(`用户邮箱: ${loginData.user.email}`)
        addLog(`邮箱验证状态: ${loginData.user.email_confirmed_at ? '已验证' : '未验证'}`)
        addLog(`验证时间: ${loginData.user.email_confirmed_at || '无'}`)
        
        // 3. 验证会话
        const { data: { session: newSession } } = await supabase.auth.getSession()
        addLog(`新会话状态: ${newSession ? '已创建' : '未创建'}`)
        
        if (newSession) {
          addLog(`访问令牌: ${newSession.access_token.substring(0, 20)}...`)
          addLog(`刷新令牌: ${newSession.refresh_token.substring(0, 20)}...`)
        }
        
        // 4. 登出测试用户
        addLog('登出测试用户...')
        await supabase.auth.signOut()
        addLog('✅ 已登出')
      }
      
    } catch (error) {
      addLog(`❌ 异常错误: ${error instanceof Error ? error.message : String(error)}`)
      console.error('Auth test exception:', error)
    } finally {
      setLoading(false)
      addLog('=== 测试完成 ===')
      // 最后一次性设置所有日志
      setDebugInfo(logs)
    }
  }
  
  const clearDebugInfo = () => {
    setDebugInfo([])
  }
  
  const checkNetworkIssues = async () => {
    // 收集网络检查信息
    const logs: string[] = []
    const addLog = (info: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${info}`)
    }
    
    addLog('=== 网络连接检查 ===')
    
    // 检查 Supabase 连接
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      })
      
      if (response.ok) {
        addLog('✅ Supabase 服务正常')
      } else {
        addLog(`❌ Supabase 服务异常: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      addLog(`❌ 无法连接 Supabase: ${error instanceof Error ? error.message : String(error)}`)
    }
    
    // 合并到现有调试信息
    setDebugInfo(prev => [...prev, ...logs])
  }
  
  return (
    <div className="border rounded-lg p-4 bg-gray-50 max-w-2xl">
      <h3 className="text-lg font-semibold mb-3">
        {locale==='zh'?'🔧 认证调试工具':'🔧 Authentication Debugger'}
      </h3>
      
      <div className="grid gap-3 mb-4">
        <Input 
          placeholder={locale==='zh'?'测试邮箱':'Test Email'} 
          value={testEmail} 
          onChange={(e) => setTestEmail(e.target.value)}
          type="email"
        />
        <Input 
          placeholder={locale==='zh'?'测试密码':'Test Password'} 
          value={testPassword} 
          onChange={(e) => setTestPassword(e.target.value)}
          type="password"
        />
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testAuth} disabled={loading || !testEmail || !testPassword}>
            {loading ? (locale==='zh'?'测试中...':'Testing...') : (locale==='zh'?'开始测试':'Start Test')}
          </Button>
          <Button variant="outline" onClick={checkNetworkIssues}>
            {locale==='zh'?'检查网络':'Check Network'}
          </Button>
          <Button variant="outline" onClick={clearDebugInfo}>
            {locale==='zh'?'清除日志':'Clear Logs'}
          </Button>
        </div>
      </div>
      
      {debugInfo.length > 0 && (
        <div className="border rounded p-3 bg-black text-green-400 text-xs font-mono max-h-96 overflow-y-auto">
          <div className="mb-2 text-yellow-400">
            {locale==='zh'?'调试日志 (复制此内容给技术支持):':'Debug Logs (Copy this for technical support):'}
          </div>
          {debugInfo.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <div className="font-semibold text-blue-800 mb-2">
          {locale==='zh'?'💡 使用说明:':'💡 Instructions:'}
        </div>
        <ul className="list-disc pl-4 space-y-1 text-blue-700">
          <li>{locale==='zh'?'输入您注册时使用的邮箱和密码':'Enter the email and password you used to register'}</li>
          <li>{locale==='zh'?'点击"开始测试"来运行详细的认证诊断':'Click "Start Test" to run detailed authentication diagnostics'}</li>
          <li>{locale==='zh'?'查看调试日志来了解具体的错误原因':'Check the debug logs to understand the specific error reasons'}</li>
          <li>{locale==='zh'?'如果问题持续，复制日志内容寻求技术支持':'If issues persist, copy the log content for technical support'}</li>
        </ul>
      </div>
    </div>
  )
}