import { QuestionCategory } from './index';

// Supported languages
export type SupportedLocale = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'zh' | 'ja';

// RTL languages
export const RTL_LANGUAGES: SupportedLocale[] = ['ar'];

// Language metadata
export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  pluralRules: Intl.PluralRules;
}

// Language configuration
export const LANGUAGES: Record<SupportedLocale, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    pluralRules: new Intl.PluralRules('en'),
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    pluralRules: new Intl.PluralRules('fr'),
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    pluralRules: new Intl.PluralRules('ar'),
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    pluralRules: new Intl.PluralRules('es'),
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    pluralRules: new Intl.PluralRules('de'),
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    pluralRules: new Intl.PluralRules('zh'),
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    pluralRules: new Intl.PluralRules('ja'),
  },
};

// Localized question structure
export interface LocalizedQuestion {
  id: string;
  domain: QuestionCategory;
  difficulty: number;
  timeLimit: number;
  // IRT parameters (language-independent)
  a: number;
  b: number;
  c: number;
  // Calibration metadata
  timesAnswered: number;
  timesCorrect: number;
  averageResponseTime: number;
  lastCalibrated: Date;
  // Localized content
  translations: Record<SupportedLocale, QuestionTranslation>;
  // Cultural bias metrics
  culturalMetrics?: CulturalBiasMetrics;
}

export interface QuestionTranslation {
  question: string;
  options: string[];
  explanation?: string;
  // Validation metadata
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  // Cultural adaptation notes
  culturalNotes?: string;
  // Difficulty adjustment for this locale
  difficultyAdjustment?: number;
}

// Cultural bias detection
export interface CulturalBiasMetrics {
  localePerformance: Record<SupportedLocale, LocalePerformance>;
  biasFlags: BiasFlag[];
  lastAnalyzed: Date;
  confidenceLevel: number; // 0-1
}

export interface LocalePerformance {
  locale: SupportedLocale;
  averageScore: number;
  responseTime: number;
  sampleSize: number;
  difficultyVariance: number;
  flagged: boolean;
}

export interface BiasFlag {
  type: 'cultural' | 'linguistic' | 'educational' | 'socioeconomic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedLocales: SupportedLocale[];
  detectedAt: Date;
  resolved: boolean;
}

// Translation validation
export interface TranslationValidation {
  questionId: string;
  locale: SupportedLocale;
  validator: string;
  validatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  comments?: string;
  skillEquivalence: number; // 0-1, how well it tests the same skill
  difficultyEquivalence: number; // 0-1, how similar the difficulty is
}

// Localization metadata
export interface LocalizationMetadata {
  totalQuestions: number;
  translatedQuestions: Record<SupportedLocale, number>;
  validatedQuestions: Record<SupportedLocale, number>;
  completionPercentage: Record<SupportedLocale, number>;
  lastUpdated: Record<SupportedLocale, Date>;
  translators: Record<SupportedLocale, string[]>;
}

// Gamification localization
export interface LocalizedBadge {
  id: string;
  translations: Record<SupportedLocale, BadgeTranslation>;
  category: QuestionCategory | 'general';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface BadgeTranslation {
  name: string;
  description: string;
  // Handle grammatical gender and pluralization
  nameVariants?: {
    masculine?: string;
    feminine?: string;
    plural?: string;
  };
}

// IQ Classification localization
export interface LocalizedIQClassification {
  range: [number, number];
  translations: Record<SupportedLocale, IQClassificationTranslation>;
}

export interface IQClassificationTranslation {
  label: string;
  description: string;
  percentileDescription: string;
}

// Number and date formatting
export interface LocaleFormatting {
  locale: SupportedLocale;
  numberFormat: Intl.NumberFormat;
  dateFormat: Intl.DateTimeFormat;
  currencyFormat: Intl.NumberFormat;
  percentFormat: Intl.NumberFormat;
  timeFormat: Intl.DateTimeFormat;
}

// Translation extraction and management
export interface TranslationKey {
  key: string;
  namespace: string;
  defaultValue: string;
  context?: string;
  description?: string;
  maxLength?: number;
  pluralization?: boolean;
}

export interface TranslationStats {
  locale: SupportedLocale;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  outdatedKeys: string[];
  completionPercentage: number;
  lastUpdated: Date;
}

// Font and typography support
export interface TypographyConfig {
  locale: SupportedLocale;
  fontFamily: string;
  fontSize: {
    base: string;
    heading: string;
    small: string;
  };
  lineHeight: {
    base: number;
    heading: number;
  };
  letterSpacing: string;
  textDirection: 'ltr' | 'rtl';
  writingMode: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
}

// Export utility types
export type TranslationFunction = (key: string, options?: any) => string;
export type LocaleChangeHandler = (locale: SupportedLocale) => void;
export type TranslationNamespace = 'common' | 'test' | 'questions' | 'results' | 'gamification'; 