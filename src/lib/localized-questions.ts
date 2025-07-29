import { questions } from '@/data/questions';
import { Question, QuestionCategory } from '@/types';

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to get balanced questions by category
function getBalancedQuestions(allQuestions: Question[], totalQuestions: number): Question[] {
  // Group questions by category
  const questionsByCategory = new Map<QuestionCategory, Question[]>();
  for (const category of Object.values(QuestionCategory)) {
    questionsByCategory.set(
      category,
      allQuestions.filter(q => q.category === category)
    );
  }

  // Calculate questions per category
  const questionsPerCategory = Math.floor(totalQuestions / Object.keys(QuestionCategory).length);
  const remainingQuestions = totalQuestions % Object.keys(QuestionCategory).length;

  // Get balanced questions
  let selectedQuestions: Question[] = [];
  Object.values(QuestionCategory).forEach((category, index) => {
    const categoryQuestions = questionsByCategory.get(category) || [];
    const numQuestionsToSelect = questionsPerCategory + (index < remainingQuestions ? 1 : 0);
    
    selectedQuestions = [
      ...selectedQuestions,
      ...shuffleArray(categoryQuestions).slice(0, numQuestionsToSelect)
    ];
  });

  return shuffleArray(selectedQuestions);
}

export function getLocalizedQuestions(locale: string, totalQuestions: number = 35): Question[] {
  // For now, we only have English questions
  // In the future, we can load localized questions based on locale
  const allQuestions = questions;
  
  // Get balanced questions based on total questions needed
  return getBalancedQuestions(allQuestions, totalQuestions);
}

export function getLocalizedQuestion(questionId: string, locale: string): Question | null {
  console.log('getLocalizedQuestion called with:', { questionId, locale });
  const localizedQuestions = getLocalizedQuestions(locale);
  const result = localizedQuestions.find(q => q.id === questionId) || null;
  console.log('getLocalizedQuestion result:', result ? 'Found translation' : 'No translation found');
  if (result) {
    console.log('Translated question text:', result.question);
  }
  return result;
}
