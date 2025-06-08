import { Question, QuestionCategory } from '@/types';
import { questions } from '@/data/questions';

// Arabic translations for a subset of questions
const arabicQuestions: Partial<Record<string, { question: string; options: string[]; explanation: string }>> = {
  'pr_001': {
    question: 'ما هو الرقم التالي في هذا التسلسل: 2، 4، 6، 8، ؟',
    options: ['9', '10', '11', '12'],
    explanation: 'التسلسل يزيد بـ 2 في كل مرة: 2+2=4، 4+2=6، 6+2=8، 8+2=10'
  },
  'pr_002': {
    question: 'أكمل النمط: A، C، E، G، ؟',
    options: ['H', 'I', 'J', 'K'],
    explanation: 'تخطي حرف واحد في كل مرة: A(تخطي B)C(تخطي D)E(تخطي F)G(تخطي H)I'
  },
  'pr_003': {
    question: 'ما هو الرقم الذي يجب أن يحل محل علامة الاستفهام: 3، 6، 12، 24، ؟',
    options: ['36', '48', '42', '30'],
    explanation: 'كل رقم يتم مضاعفته: 3×2=6، 6×2=12، 12×2=24، 24×2=48'
  },
  'pr_004': {
    question: 'اعثر على الحد التالي: 1، 1، 2، 3، 5، 8، ؟',
    options: ['11', '13', '15', '16'],
    explanation: 'متتالية فيبوناتشي: كل رقم هو مجموع الرقمين السابقين (1+1=2، 1+2=3، 2+3=5، 3+5=8، 5+8=13)'
  },
  'sr_001': {
    question: 'كم عدد أضلاع المثلث؟',
    options: ['2', '3', '4', '5'],
    explanation: 'المثلث بحكم التعريف له 3 أضلاع'
  },
  'sr_002': {
    question: 'إذا قمت بتدوير مربع 90 درجة، ما هو الشكل الذي تحصل عليه؟',
    options: ['مستطيل', 'مربع', 'مثلث', 'دائرة'],
    explanation: 'تدوير المربع 90 درجة لا يزال ينتج عنه مربع'
  },
  'sr_003': {
    question: 'كم عدد وجوه المكعب؟',
    options: ['4', '6', '8', '12'],
    explanation: 'المكعب له 6 وجوه: علوي، سفلي، أمامي، خلفي، يسار، يمين'
  },
  'lg_001': {
    question: 'جميع القطط حيوانات. فلافي قطة. إذن:',
    options: ['فلافي حيوان', 'فلافي ليس حيوان', 'بعض القطط حيوانات', 'لا يمكن تحديد ذلك'],
    explanation: 'هذا استنتاج منطقي صحيح: جميع القطط حيوانات، فلافي قطة، إذن فلافي حيوان'
  },
  'lg_002': {
    question: 'إذا كان اليوم الثلاثاء، فإن غداً سيكون:',
    options: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    explanation: 'إذا كان اليوم الثلاثاء، فإن غداً سيكون الأربعاء'
  },
  'nr_001': {
    question: 'ما هو 15% من 100؟',
    options: ['10', '15', '20', '25'],
    explanation: '15% من 100 = 15/100 × 100 = 15'
  },
  'nr_002': {
    question: 'إذا كان س + 5 = 12، فما هو س؟',
    options: ['5', '7', '17', '60'],
    explanation: 'س + 5 = 12، إذن س = 12 - 5 = 7'
  },
  'sm_001': {
    question: 'تذكر هذا التسلسل: 3، 7، 1. ما هو الرقم الثاني؟',
    options: ['3', '7', '1', '4'],
    explanation: 'التسلسل كان 3، 7، 1. الرقم الثاني كان 7.'
  },
  'sm_002': {
    question: 'ادرس هذه القائمة: قطة، كلب، طائر، سمكة. أي حيوان كان الثالث؟',
    options: ['قطة', 'كلب', 'طائر', 'سمكة'],
    explanation: 'القائمة كانت قطة، كلب، طائر، سمكة. الطائر كان الحيوان الثالث.'
  }
};

// French translations for a subset of questions
const frenchQuestions: Partial<Record<string, { question: string; options: string[]; explanation: string }>> = {
  'pr_001': {
    question: 'Que vient ensuite dans cette séquence : 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    explanation: 'La séquence augmente de 2 à chaque fois : 2+2=4, 4+2=6, 6+2=8, 8+2=10'
  },
  'pr_002': {
    question: 'Complétez le motif : A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    explanation: 'Sautez une lettre à chaque fois : A(sauter B)C(sauter D)E(sauter F)G(sauter H)I'
  },
  'sr_001': {
    question: 'Combien de côtés a un triangle ?',
    options: ['2', '3', '4', '5'],
    explanation: 'Un triangle a par définition 3 côtés'
  },
  'lg_001': {
    question: 'Tous les chats sont des animaux. Fluffy est un chat. Donc :',
    options: ['Fluffy est un animal', 'Fluffy n\'est pas un animal', 'Certains chats sont des animaux', 'On ne peut pas le déterminer'],
    explanation: 'C\'est une déduction logique valide : tous les chats sont des animaux, Fluffy est un chat, donc Fluffy est un animal'
  },
  'nr_001': {
    question: 'Combien font 15% de 100 ?',
    options: ['10', '15', '20', '25'],
    explanation: '15% de 100 = 15/100 × 100 = 15'
  }
};

export function getLocalizedQuestions(locale: string): Question[] {
  const normalizedLocale = locale.split('-')[0]; // Convert en-US to en
  
  return questions.map(question => {
    let localizedContent;
    
    switch (normalizedLocale) {
      case 'ar':
        localizedContent = arabicQuestions[question.id];
        break;
      case 'fr':
        localizedContent = frenchQuestions[question.id];
        break;
      default:
        localizedContent = null;
    }
    
    if (localizedContent) {
      return {
        ...question,
        question: localizedContent.question,
        options: localizedContent.options,
        explanation: localizedContent.explanation
      };
    }
    
    return question; // Return original if no translation available
  });
}

export function getLocalizedQuestion(questionId: string, locale: string): Question | null {
  const localizedQuestions = getLocalizedQuestions(locale);
  return localizedQuestions.find(q => q.id === questionId) || null;
}
