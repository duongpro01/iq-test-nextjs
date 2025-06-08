import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { SupportedLocale, LANGUAGES, RTL_LANGUAGES } from '@/types/i18n';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace configuration
    ns: ['common', 'test', 'questions', 'results', 'gamification'],
    defaultNS: 'common',
    
    // Language detection
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true,
    },
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'number') return new Intl.NumberFormat(lng).format(value);
        if (format === 'currency') return new Intl.NumberFormat(lng, { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
        if (format === 'percent') return new Intl.NumberFormat(lng, { 
          style: 'percent' 
        }).format(value);
        if (format === 'date') return new Intl.DateTimeFormat(lng).format(new Date(value));
        if (format === 'time') return new Intl.DateTimeFormat(lng, { 
          timeStyle: 'short' 
        }).format(new Date(value));
        return value;
      }
    },
    
    // React specific
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
    },
  });

// Utility functions
export const getCurrentLocale = (): SupportedLocale => {
  const currentLang = i18n.language;
  return Object.keys(LANGUAGES).includes(currentLang) 
    ? currentLang as SupportedLocale 
    : 'en';
};

export const isRTL = (locale?: SupportedLocale): boolean => {
  const currentLocale = locale || getCurrentLocale();
  return RTL_LANGUAGES.includes(currentLocale);
};

export const getLanguageInfo = (locale: SupportedLocale) => {
  return LANGUAGES[locale];
};

export const changeLanguage = async (locale: SupportedLocale): Promise<void> => {
  await i18n.changeLanguage(locale);
  
  // Update document direction
  document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
  
  // Update CSS custom properties for RTL
  if (isRTL(locale)) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
};

// Number formatting utilities
export const formatNumber = (
  value: number, 
  locale?: SupportedLocale,
  options?: Intl.NumberFormatOptions
): string => {
  const currentLocale = locale || getCurrentLocale();
  return new Intl.NumberFormat(currentLocale, options).format(value);
};

export const formatPercent = (value: number, locale?: SupportedLocale): string => {
  return formatNumber(value, locale, { style: 'percent', maximumFractionDigits: 1 });
};

export const formatCurrency = (
  value: number, 
  locale?: SupportedLocale, 
  currency = 'USD'
): string => {
  return formatNumber(value, locale, { style: 'currency', currency });
};

// Date formatting utilities
export const formatDate = (
  date: Date | string | number, 
  locale?: SupportedLocale,
  options?: Intl.DateTimeFormatOptions
): string => {
  const currentLocale = locale || getCurrentLocale();
  return new Intl.DateTimeFormat(currentLocale, options).format(new Date(date));
};

export const formatTime = (
  date: Date | string | number, 
  locale?: SupportedLocale
): string => {
  return formatDate(date, locale, { timeStyle: 'short' });
};

export const formatDateTime = (
  date: Date | string | number, 
  locale?: SupportedLocale
): string => {
  return formatDate(date, locale, { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });
};

// Pluralization utilities
export const getPlural = (
  count: number, 
  locale?: SupportedLocale
): Intl.LDMLPluralRule => {
  const currentLocale = locale || getCurrentLocale();
  const pluralRules = new Intl.PluralRules(currentLocale);
  return pluralRules.select(count);
};

// Text direction utilities
export const getTextDirection = (locale?: SupportedLocale): 'ltr' | 'rtl' => {
  return isRTL(locale) ? 'rtl' : 'ltr';
};

// Font loading for different scripts
export const loadFontsForLocale = async (locale: SupportedLocale): Promise<void> => {
  const fontMap: Record<SupportedLocale, string[]> = {
    en: ['Inter', 'system-ui'],
    fr: ['Inter', 'system-ui'],
    es: ['Inter', 'system-ui'],
    de: ['Inter', 'system-ui'],
    ar: ['Noto Sans Arabic', 'system-ui'],
    zh: ['Noto Sans SC', 'system-ui'],
    ja: ['Noto Sans JP', 'system-ui'],
  };

  const fonts = fontMap[locale];
  if (fonts && 'fonts' in document) {
    try {
      await Promise.all(
        fonts.map(font => (document as any).fonts.load(`16px ${font}`))
      );
    } catch (error) {
      console.warn('Failed to load fonts for locale:', locale, error);
    }
  }
};

// Validation for translation completeness
export const validateTranslations = (
  translations: Record<string, any>,
  requiredKeys: string[]
): { isValid: boolean; missingKeys: string[] } => {
  const missingKeys: string[] = [];
  
  const checkKeys = (obj: any, keyPath = ''): void => {
    for (const key of requiredKeys) {
      const fullKey = keyPath ? `${keyPath}.${key}` : key;
      const keys = fullKey.split('.');
      let current = obj;
      
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          missingKeys.push(fullKey);
          break;
        }
      }
    }
  };
  
  checkKeys(translations);
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};

export default i18n; 