import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Question } from '@/types';
import { questions } from '@/data/questions';

// Import localized questions dynamically
const getLocalizedQuestions = async (locale: string): Promise<Question[]> => {
  try {
    switch (locale) {
      case 'ar':
        const { questionsAr } = await import('@/data/questions-ar');
        return questionsAr;
      case 'fr':
        const { questionsFr } = await import('@/data/questions-fr');
        return questionsFr;
      case 'es':
      case 'de':
      case 'zh':
      case 'ja':
      case 'en':
      default:
        return questions;
    }
  } catch (error) {
    console.warn(`Failed to load questions for locale ${locale}, falling back to English:`, error);
    return questions;
  }
};

export const useLocalizedQuestions = () => {
  const { i18n } = useTranslation();
  const [localizedQuestions, setLocalizedQuestions] = useState<Question[]>(questions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const currentLocale = i18n.language.split('-')[0]; // Convert en-US to en
        const questionsForLocale = await getLocalizedQuestions(currentLocale);
        setLocalizedQuestions(questionsForLocale);
      } catch (error) {
        console.error('Error loading localized questions:', error);
        setLocalizedQuestions(questions); // Fallback to English
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [i18n.language]);

  return {
    questions: localizedQuestions,
    isLoading,
    locale: i18n.language.split('-')[0]
  };
}; 