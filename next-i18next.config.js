module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localePath: './public/locales',
    localeDetection: false,
  },
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // Namespace configuration
  ns: ['common', 'test', 'questions', 'results', 'gamification'],
  defaultNS: 'common',
  
  // Performance optimization
  load: 'languageOnly',
  preload: ['en'],
  
  // Interpolation settings
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
    format: function(value, format, lng) {
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'lowercase') return value.toLowerCase();
      if (format === 'number') return new Intl.NumberFormat(lng).format(value);
      if (format === 'currency') return new Intl.NumberFormat(lng, { style: 'currency', currency: 'USD' }).format(value);
      return value;
    }
  },
  
  // Pluralization
  pluralSeparator: '_',
  contextSeparator: '_',
  
  // Backend configuration for loading translations
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  
  // React specific options
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
  },
  
  // Custom detection order
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'],
    lookupLocalStorage: 'i18nextLng',
    checkWhitelist: true,
  }
}; 