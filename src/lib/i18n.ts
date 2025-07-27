import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Initialize i18next
i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Supported languages
    supportedLngs: ['en'],
    
    // Namespace configuration
    ns: ['common', 'test', 'questions', 'results', 'gamification'],
    defaultNS: 'common',
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
      format: function(value, format) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'number') return new Intl.NumberFormat('en').format(value);
        if (format === 'currency') return new Intl.NumberFormat('en', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
        if (format === 'percent') return new Intl.NumberFormat('en', { 
          style: 'percent' 
        }).format(value);
        if (format === 'date') return new Intl.DateTimeFormat('en').format(new Date(value));
        if (format === 'time') return new Intl.DateTimeFormat('en', { 
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
export const getCurrentLocale = () => 'en';
export const isRTL = () => false;
export const getLanguageInfo = () => ({
  code: 'en',
  name: 'English',
  nativeName: 'English',
  flag: '🇺🇸',
  rtl: false
});

// Number formatting utilities
export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat('en', options).format(value);
};

export const formatPercent = (value: number): string => {
  return formatNumber(value, { style: 'percent', maximumFractionDigits: 1 });
};

export const formatCurrency = (
  value: number,
  currency = 'USD'
): string => {
  return formatNumber(value, { style: 'currency', currency });
};

// Date formatting utilities
export const formatDate = (
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat('en', options).format(new Date(date));
};

export const formatTime = (
  date: Date | string | number
): string => {
  return formatDate(date, { timeStyle: 'short' });
};

export const formatDateTime = (
  date: Date | string | number
): string => {
  return formatDate(date, { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });
};

// Pluralization utilities
export const getPlural = (count: number): Intl.LDMLPluralRule => {
  const pluralRules = new Intl.PluralRules('en');
  return pluralRules.select(count);
};

// Text direction utilities
export const getTextDirection = (): 'ltr' => 'ltr';

// Font loading
export const loadFontsForLocale = async (): Promise<void> => {
  if ('fonts' in document) {
    try {
      await (document as any).fonts.load('16px Inter');
    } catch (error) {
      console.warn('Failed to load fonts:', error);
    }
  }
};

export default i18n; 