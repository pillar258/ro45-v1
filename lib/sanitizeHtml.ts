export function sanitizeHtml(html: string): string {
  if (!html) return ''
  let s = html
  // 移除script标签及其内容
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  // 移除事件处理器属性
  s = s.replace(/on[a-z]+\s*=\s*"[^"]*"/gi, '')
  s = s.replace(/on[a-z]+\s*=\s*'[^']*'/gi, '')
  s = s.replace(/on[a-z]+\s*=\s*[^\s>]+/gi, '')
  // 移除javascript:协议
  s = s.replace(/javascript:/gi, '')
  // 移除data:协议（防止data URI攻击）
  s = s.replace(/data:[^\s"']*/gi, '')
  // 移除iframe和object标签（防止嵌入攻击）
  s = s.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
  s = s.replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
  s = s.replace(/<embed[\s\S]*?>/gi, '')
  // 移除form标签（防止表单劫持）
  s = s.replace(/<form[\s\S]*?>[\s\S]*?<\/form>/gi, '')
  // 移除meta和link标签
  s = s.replace(/<meta[\s\S]*?>/gi, '')
  s = s.replace(/<link[\s\S]*?>/gi, '')
  // 移除style标签中的@import和expression
  s = s.replace(/@import[^;]*;/gi, '')
  s = s.replace(/expression\s*\([^)]*\)/gi, '')
  // 限制属性值长度，防止属性膨胀攻击
  s = s.replace(/\s[a-z-]+\s*=\s*"[^"]{1000,}"/gi, (match) => match.slice(0, 1000) + '"')
  s = s.replace(/\s[a-z-]+\s*=\s*'[^']{1000,}'/gi, (match) => match.slice(0, 1000) + "'")
  return s
}