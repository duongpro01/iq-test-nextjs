import { Question, QuestionCategory } from '@/types';
import { SupportedLocale } from '@/types/i18n';
import { questions } from '@/data/questions';

// Dynamic imports for localized questions
const getLocalizedQuestions = async (locale: SupportedLocale): Promise<Question[]> => {
  try {
    switch (locale) {
      case 'ar':
        const { questionsAr } = await import('@/data/questions-ar');
        return questionsAr;
      case 'fr':
        const { questionsFr } = await import('@/data/questions-fr');
        return questionsFr;
      case 'es':
        // For now, fallback to English for Spanish
        return questions;
      case 'de':
        // For now, fallback to English for German
        return questions;
      case 'zh':
        // For now, fallback to English for Chinese
        return questions;
      case 'ja':
        // For now, fallback to English for Japanese
        return questions;
      case 'en':
      default:
        return questions;
    }
  } catch (error) {
    console.warn(`Failed to load questions for locale ${locale}, falling back to English:`, error);
    return questions;
  }
};

export class QuestionService {
  private static instance: QuestionService;
  private questionsCache: Map<SupportedLocale, Question[]> = new Map();

  private constructor() {}

  static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  async getQuestions(locale: SupportedLocale = 'en'): Promise<Question[]> {
    // Check cache first
    if (this.questionsCache.has(locale)) {
      return this.questionsCache.get(locale)!;
    }

    // Load questions for the locale
    const localizedQuestions = await getLocalizedQuestions(locale);
    
    // Cache the questions
    this.questionsCache.set(locale, localizedQuestions);
    
    return localizedQuestions;
  }

  async getQuestionsByDifficulty(difficulty: number, locale: SupportedLocale = 'en'): Promise<Question[]> {
    const allQuestions = await this.getQuestions(locale);
    return allQuestions.filter(q => q.difficulty === difficulty);
  }

  async getQuestionsByCategory(category: QuestionCategory, locale: SupportedLocale = 'en'): Promise<Question[]> {
    const allQuestions = await this.getQuestions(locale);
    return allQuestions.filter(q => q.category === category);
  }

  async getQuestionById(id: string, locale: SupportedLocale = 'en'): Promise<Question | undefined> {
    const allQuestions = await this.getQuestions(locale);
    return allQuestions.find(q => q.id === id);
  }

  async organizeQuestionPools(locale: SupportedLocale = 'en'): Promise<Record<number, Question[]>> {
    const allQuestions = await this.getQuestions(locale);
    const pools: Record<number, Question[]> = {};
    
    for (let difficulty = 1; difficulty <= 10; difficulty++) {
      pools[difficulty] = allQuestions.filter(q => q.difficulty === difficulty);
    }
    
    return pools;
  }

  // Clear cache when locale changes
  clearCache(): void {
    this.questionsCache.clear();
  }

  // Preload questions for a locale
  async preloadQuestions(locale: SupportedLocale): Promise<void> {
    if (!this.questionsCache.has(locale)) {
      await this.getQuestions(locale);
    }
  }
}

// Export singleton instance
export const questionService = QuestionService.getInstance(); 