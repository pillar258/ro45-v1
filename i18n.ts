export const locales = ['zh-HK', 'zh', 'en'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = locales[0]