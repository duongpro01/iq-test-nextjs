import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Question } from '@/types';
import { getLocalizedQuestion } from '@/lib/localized-questions';

export const useLocalizedQuestion = (question: Question): Question => {
  const { i18n } = useTranslation();
  
  const localizedQuestion = useMemo(() => {
    const currentLocale = i18n.language.split('-')[0]; // Convert en-US to en
    const localized = getLocalizedQuestion(question.id, currentLocale);
    return localized || question; // Fallback to original if no translation
  }, [question, i18n.language]);

  return localizedQuestion;
};
