import { 
  LocalizedQuestion, 
  QuestionTranslation, 
  SupportedLocale,
  TranslationValidation 
} from '@/types/i18n';
import { Question, QuestionCategory } from '@/types';
import { getCurrentLocale } from '@/lib/i18n';

interface QuestionSchema {
  id: string;
  domain: QuestionCategory;
  difficulty: number;
  timeLimit: number;
  a: number; // IRT discrimination parameter
  b: number; // IRT difficulty parameter
  c: number; // IRT guessing parameter
  translations: Record<SupportedLocale, QuestionTranslation>;
  metadata?: {
    created: Date;
    lastUpdated: Date;
    version: number;
    tags: string[];
  };
}

export class LocalizedQuestionManager {
  private questions: Map<string, QuestionSchema> = new Map();
  private validations: Map<string, TranslationValidation[]> = new Map();
  private fallbackLocale: SupportedLocale = 'en';

  constructor() {
    this.loadQuestions();
  }

  // Add a new localized question
  addQuestion(question: QuestionSchema): void {
    // Validate required translations
    if (!question.translations[this.fallbackLocale]) {
      throw new Error(`Question must have ${this.fallbackLocale} translation`);
    }

    // Set metadata
    question.metadata = {
      created: new Date(),
      lastUpdated: new Date(),
      version: 1,
      tags: [],
      ...question.metadata,
    };

    this.questions.set(question.id, question);
    this.saveQuestions();
  }

  // Get question in specific locale with fallback
  getQuestion(
    questionId: string, 
    locale?: SupportedLocale,
    includeMetadata = false
  ): Question | null {
    const currentLocale = locale || getCurrentLocale();
    const questionSchema = this.questions.get(questionId);
    
    if (!questionSchema) {
      return null;
    }

    // Try to get translation in requested locale
    let translation = questionSchema.translations[currentLocale];
    
    // Fallback to English if translation doesn't exist
    if (!translation) {
      translation = questionSchema.translations[this.fallbackLocale];
      console.warn(`Translation not found for ${questionId} in ${currentLocale}, using ${this.fallbackLocale}`);
    }

    // Still no translation found
    if (!translation) {
      console.error(`No translation found for question ${questionId}`);
      return null;
    }

    // Apply difficulty adjustment for locale if specified
    const adjustedDifficulty = translation.difficultyAdjustment 
      ? questionSchema.difficulty + translation.difficultyAdjustment
      : questionSchema.difficulty;

    const question: Question = {
      id: questionSchema.id,
      category: questionSchema.domain,
      difficulty: Math.max(1, Math.min(10, adjustedDifficulty)),
      timeLimit: questionSchema.timeLimit,
      question: translation.question,
      options: translation.options,
      correctAnswer: 0, // This should be determined by the test logic
      explanation: translation.explanation,
      // IRT parameters
      a: questionSchema.a,
      b: questionSchema.b,
      c: questionSchema.c,
    };

    // Add metadata if requested
    if (includeMetadata && questionSchema.metadata) {
      (question as any).metadata = {
        ...questionSchema.metadata,
        currentLocale,
        translationValidated: translation.validated,
        culturalNotes: translation.culturalNotes,
      };
    }

    return question;
  }

  // Get all questions for a locale
  getQuestionsForLocale(
    locale?: SupportedLocale,
    category?: QuestionCategory,
    difficultyRange?: [number, number]
  ): Question[] {
    const currentLocale = locale || getCurrentLocale();
    const questions: Question[] = [];

    for (const [questionId, questionSchema] of this.questions) {
      // Filter by category if specified
      if (category && questionSchema.domain !== category) {
        continue;
      }

      // Filter by difficulty range if specified
      if (difficultyRange) {
        const [minDiff, maxDiff] = difficultyRange;
        if (questionSchema.difficulty < minDiff || questionSchema.difficulty > maxDiff) {
          continue;
        }
      }

      const question = this.getQuestion(questionId, currentLocale);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  // Add translation for existing question
  addTranslation(
    questionId: string,
    locale: SupportedLocale,
    translation: QuestionTranslation
  ): void {
    const question = this.questions.get(questionId);
    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    question.translations[locale] = translation;
    
    if (question.metadata) {
      question.metadata.lastUpdated = new Date();
      question.metadata.version += 1;
    }

    this.questions.set(questionId, question);
    this.saveQuestions();
  }

  // Validate translation
  validateTranslation(validation: TranslationValidation): void {
    const questionValidations = this.validations.get(validation.questionId) || [];
    questionValidations.push(validation);
    this.validations.set(validation.questionId, questionValidations);

    // Update translation validation status
    const question = this.questions.get(validation.questionId);
    if (question && question.translations[validation.locale]) {
      question.translations[validation.locale].validated = validation.status === 'approved';
      question.translations[validation.locale].validatedBy = validation.validator;
      question.translations[validation.locale].validatedAt = validation.validatedAt;
      
      this.questions.set(validation.questionId, question);
    }

    this.saveValidations();
  }

  // Get translation completeness statistics
  getTranslationStats(): Record<SupportedLocale, {
    total: number;
    translated: number;
    validated: number;
    completionPercentage: number;
    validationPercentage: number;
  }> {
    const stats: Record<SupportedLocale, any> = {};
    const locales: SupportedLocale[] = ['en', 'fr', 'ar', 'es', 'de', 'zh', 'ja'];
    
    const totalQuestions = this.questions.size;

    for (const locale of locales) {
      let translated = 0;
      let validated = 0;

      for (const [_, question] of this.questions) {
        const translation = question.translations[locale];
        if (translation) {
          translated++;
          if (translation.validated) {
            validated++;
          }
        }
      }

      stats[locale] = {
        total: totalQuestions,
        translated,
        validated,
        completionPercentage: totalQuestions > 0 ? (translated / totalQuestions) * 100 : 0,
        validationPercentage: translated > 0 ? (validated / translated) * 100 : 0,
      };
    }

    return stats;
  }

  // Get missing translations
  getMissingTranslations(locale: SupportedLocale): string[] {
    const missing: string[] = [];

    for (const [questionId, question] of this.questions) {
      if (!question.translations[locale]) {
        missing.push(questionId);
      }
    }

    return missing;
  }

  // Get questions needing validation
  getQuestionsNeedingValidation(locale: SupportedLocale): string[] {
    const needingValidation: string[] = [];

    for (const [questionId, question] of this.questions) {
      const translation = question.translations[locale];
      if (translation && !translation.validated) {
        needingValidation.push(questionId);
      }
    }

    return needingValidation;
  }

  // Export questions for translation
  exportForTranslation(
    locale: SupportedLocale,
    format: 'json' | 'csv' = 'json'
  ): string {
    const questionsToTranslate: any[] = [];

    for (const [questionId, question] of this.questions) {
      if (!question.translations[locale]) {
        const baseTranslation = question.translations[this.fallbackLocale];
        if (baseTranslation) {
          questionsToTranslate.push({
            id: questionId,
            domain: question.domain,
            difficulty: question.difficulty,
            sourceLocale: this.fallbackLocale,
            targetLocale: locale,
            question: baseTranslation.question,
            options: baseTranslation.options,
            explanation: baseTranslation.explanation || '',
            culturalNotes: '',
            translatedQuestion: '',
            translatedOptions: ['', '', '', ''],
            translatedExplanation: '',
            difficultyAdjustment: 0,
          });
        }
      }
    }

    if (format === 'json') {
      return JSON.stringify(questionsToTranslate, null, 2);
    } else {
      // CSV format
      const headers = [
        'id', 'domain', 'difficulty', 'sourceLocale', 'targetLocale',
        'question', 'option1', 'option2', 'option3', 'option4',
        'explanation', 'translatedQuestion', 'translatedOption1',
        'translatedOption2', 'translatedOption3', 'translatedOption4',
        'translatedExplanation', 'culturalNotes', 'difficultyAdjustment'
      ];

      const rows = questionsToTranslate.map(q => [
        q.id, q.domain, q.difficulty, q.sourceLocale, q.targetLocale,
        `"${q.question}"`, `"${q.options[0]}"`, `"${q.options[1]}"`,
        `"${q.options[2]}"`, `"${q.options[3]}"`, `"${q.explanation}"`,
        '', '', '', '', '', '', '', '0'
      ]);

      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
  }

  // Import translated questions
  importTranslations(
    locale: SupportedLocale,
    data: string,
    format: 'json' | 'csv' = 'json'
  ): { imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      let translations: any[] = [];

      if (format === 'json') {
        translations = JSON.parse(data);
      } else {
        // Parse CSV
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= headers.length) {
            const translation: any = {};
            headers.forEach((header, index) => {
              translation[header.trim()] = values[index]?.replace(/^"|"$/g, '').trim();
            });
            translations.push(translation);
          }
        }
      }

      for (const translationData of translations) {
        try {
          const questionId = translationData.id;
          const question = this.questions.get(questionId);

          if (!question) {
            errors.push(`Question ${questionId} not found`);
            continue;
          }

          const translation: QuestionTranslation = {
            question: translationData.translatedQuestion || translationData.question,
            options: format === 'json' 
              ? translationData.translatedOptions 
              : [
                  translationData.translatedOption1,
                  translationData.translatedOption2,
                  translationData.translatedOption3,
                  translationData.translatedOption4,
                ],
            explanation: translationData.translatedExplanation,
            validated: false,
            culturalNotes: translationData.culturalNotes,
            difficultyAdjustment: parseFloat(translationData.difficultyAdjustment) || 0,
          };

          this.addTranslation(questionId, locale, translation);
          imported++;
        } catch (error) {
          errors.push(`Error importing translation for ${translationData.id}: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to parse ${format} data: ${error}`);
    }

    return { imported, errors };
  }

  // Search questions by text
  searchQuestions(
    query: string,
    locale?: SupportedLocale,
    category?: QuestionCategory
  ): Question[] {
    const currentLocale = locale || getCurrentLocale();
    const results: Question[] = [];
    const searchTerm = query.toLowerCase();

    for (const [questionId, questionSchema] of this.questions) {
      if (category && questionSchema.domain !== category) {
        continue;
      }

      const translation = questionSchema.translations[currentLocale] || 
                         questionSchema.translations[this.fallbackLocale];
      
      if (translation) {
        const questionText = translation.question.toLowerCase();
        const optionsText = translation.options.join(' ').toLowerCase();
        
        if (questionText.includes(searchTerm) || optionsText.includes(searchTerm)) {
          const question = this.getQuestion(questionId, currentLocale);
          if (question) {
            results.push(question);
          }
        }
      }
    }

    return results;
  }

  // Data persistence
  private saveQuestions(): void {
    try {
      const data = Array.from(this.questions.entries()).map(([id, question]) => ({
        id,
        ...question,
      }));
      localStorage.setItem('localized-questions', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save localized questions:', error);
    }
  }

  private loadQuestions(): void {
    try {
      const stored = localStorage.getItem('localized-questions');
      if (stored) {
        const data = JSON.parse(stored);
        this.questions.clear();
        
        for (const questionData of data) {
          const { id, ...question } = questionData;
          // Convert date strings back to Date objects
          if (question.metadata) {
            question.metadata.created = new Date(question.metadata.created);
            question.metadata.lastUpdated = new Date(question.metadata.lastUpdated);
          }
          this.questions.set(id, question);
        }
      }
    } catch (error) {
      console.warn('Failed to load localized questions:', error);
    }
  }

  private saveValidations(): void {
    try {
      const data = Array.from(this.validations.entries());
      localStorage.setItem('translation-validations', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save translation validations:', error);
    }
  }

  private loadValidations(): void {
    try {
      const stored = localStorage.getItem('translation-validations');
      if (stored) {
        const data = JSON.parse(stored);
        this.validations.clear();
        
        for (const [questionId, validations] of data) {
          this.validations.set(questionId, validations.map((v: any) => ({
            ...v,
            validatedAt: new Date(v.validatedAt),
          })));
        }
      }
    } catch (error) {
      console.warn('Failed to load translation validations:', error);
    }
  }

  // Clear all data
  clearData(): void {
    this.questions.clear();
    this.validations.clear();
    localStorage.removeItem('localized-questions');
    localStorage.removeItem('translation-validations');
  }
}

// Singleton instance
export const localizedQuestionManager = new LocalizedQuestionManager(); 