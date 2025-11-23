import type { Locale } from '../i18n'

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  zh: () => import('../dictionaries/zh.json').then((module) => module.default),
  'zh-HK': () => import('../dictionaries/zh-HK.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  console.log(`getDictionary: Attempting to load dictionary for locale: ${locale}`);
  try {
    // 1. 尝试加载请求的语言
    const dictionary = await dictionaries[locale]();
    console.log(`getDictionary: Successfully loaded dictionary for locale: ${locale}`);
    return dictionary;
  } catch (error) {
    console.warn(`getDictionary: Failed to load dictionary for ${locale}. Reason: ${error}. Falling back to zh-HK.`);
    try {
      // 2. 如果失败，尝试加载繁体中文
      const fallbackDictionary = await dictionaries['zh-HK']();
      console.log(`getDictionary: Successfully loaded fallback dictionary zh-HK.`);
      return fallbackDictionary;
    } catch (fallbackError) {
      console.error(`getDictionary: CRITICAL: Failed to load fallback dictionary zh-HK. Reason: ${fallbackError}. Falling back to en.`);
      // 3. 如果连繁体都失败，加载英文作为最终兜底
      return await dictionaries.en();
    }
  }
};