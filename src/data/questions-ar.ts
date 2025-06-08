import { Question, QuestionCategory } from '@/types';

// Helper function to generate IRT parameters based on difficulty
const generateIRTParams = (difficulty: number) => {
  const difficultyToB = (diff: number) => (diff - 5.5) * 0.6;
  const difficultyToA = (diff: number) => 0.8 + (diff / 10) * 1.4;
  
  return {
    a: Number((difficultyToA(difficulty)).toFixed(2)),
    b: Number((difficultyToB(difficulty)).toFixed(2)),
    c: 0.25,
    timesAnswered: Math.floor(Math.random() * 1000) + 100,
    timesCorrect: 0,
    averageResponseTime: 30000 + (difficulty * 5000),
    lastCalibrated: new Date()
  };
};

export const questionsAr: Question[] = [
  // PATTERN RECOGNITION - Difficulty 1-3 (Easy)
  {
    id: 'pr_001',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 1,
    question: 'ما هو الرقم التالي في هذا التسلسل: 2، 4، 6، 8، ؟',
    options: ['9', '10', '11', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'التسلسل يزيد بـ 2 في كل مرة: 2+2=4، 4+2=6، 6+2=8، 8+2=10',
    ...generateIRTParams(1)
  },
  {
    id: 'pr_002',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 2,
    question: 'أكمل النمط: A، C، E، G، ؟',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'تخطي حرف واحد في كل مرة: A(تخطي B)C(تخطي D)E(تخطي F)G(تخطي H)I',
    ...generateIRTParams(2)
  },
  {
    id: 'pr_003',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 3,
    question: 'ما هو الرقم الذي يجب أن يحل محل علامة الاستفهام: 3، 6، 12، 24، ؟',
    options: ['36', '48', '42', '30'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'كل رقم يتم مضاعفته: 3×2=6، 6×2=12، 12×2=24، 24×2=48',
    ...generateIRTParams(3)
  },
  {
    id: 'pr_004',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 4,
    question: 'اعثر على الحد التالي: 1، 1، 2، 3، 5، 8، ؟',
    options: ['11', '13', '15', '16'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'متتالية فيبوناتشي: كل رقم هو مجموع الرقمين السابقين (1+1=2، 1+2=3، 2+3=5، 3+5=8، 5+8=13)',
    ...generateIRTParams(4)
  },
  {
    id: 'pr_005',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 5,
    question: 'أكمل التسلسل: 2، 6، 18، 54، ؟',
    options: ['108', '162', '216', '270'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'كل رقم يتم ضربه في 3: 2×3=6، 6×3=18، 18×3=54، 54×3=162',
    ...generateIRTParams(5)
  },

  // SPATIAL REASONING - Difficulty 1-3 (Easy)
  {
    id: 'sr_001',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 1,
    question: 'كم عدد أضلاع المثلث؟',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: 'المثلث بحكم التعريف له 3 أضلاع',
    ...generateIRTParams(1)
  },
  {
    id: 'sr_002',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 2,
    question: 'إذا قمت بتدوير مربع 90 درجة، ما هو الشكل الذي تحصل عليه؟',
    options: ['مستطيل', 'مربع', 'مثلث', 'دائرة'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'تدوير المربع 90 درجة لا يزال ينتج عنه مربع',
    ...generateIRTParams(2)
  },
  {
    id: 'sr_003',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 3,
    question: 'كم عدد وجوه المكعب؟',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'المكعب له 6 وجوه: علوي، سفلي، أمامي، خلفي، يسار، يمين',
    ...generateIRTParams(3)
  },

  // LOGICAL DEDUCTION - Difficulty 1-3 (Easy)
  {
    id: 'lg_001',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 1,
    question: 'جميع القطط حيوانات. فلافي قطة. إذن:',
    options: ['فلافي حيوان', 'فلافي ليس حيوان', 'بعض القطط حيوانات', 'لا يمكن تحديد ذلك'],
    correctAnswer: 0,
    timeLimit: 45,
    explanation: 'هذا استنتاج منطقي صحيح: جميع القطط حيوانات، فلافي قطة، إذن فلافي حيوان',
    ...generateIRTParams(1)
  },
  {
    id: 'lg_002',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 2,
    question: 'إذا كان اليوم الثلاثاء، فإن غداً سيكون:',
    options: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    correctAnswer: 2,
    timeLimit: 30,
    explanation: 'إذا كان اليوم الثلاثاء، فإن غداً سيكون الأربعاء',
    ...generateIRTParams(2)
  },

  // NUMERICAL REASONING - Difficulty 1-3 (Easy)
  {
    id: 'nr_001',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 1,
    question: 'ما هو 15% من 100؟',
    options: ['10', '15', '20', '25'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: '15% من 100 = 15/100 × 100 = 15',
    ...generateIRTParams(1)
  },
  {
    id: 'nr_002',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 2,
    question: 'إذا كان س + 5 = 12، فما هو س؟',
    options: ['5', '7', '17', '60'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'س + 5 = 12، إذن س = 12 - 5 = 7',
    ...generateIRTParams(2)
  },

  // SHORT-TERM MEMORY - Difficulty 1-2 (Easy)
  {
    id: 'sm_001',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 1,
    question: 'تذكر هذا التسلسل: 3، 7، 1. ما هو الرقم الثاني؟',
    options: ['3', '7', '1', '4'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: 'التسلسل كان 3، 7، 1. الرقم الثاني كان 7.',
    ...generateIRTParams(1)
  },
  {
    id: 'sm_002',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 2,
    question: 'ادرس هذه القائمة: قطة، كلب، طائر، سمكة. أي حيوان كان الثالث؟',
    options: ['قطة', 'كلب', 'طائر', 'سمكة'],
    correctAnswer: 2,
    timeLimit: 45,
    explanation: 'القائمة كانت قطة، كلب، طائر، سمكة. الطائر كان الحيوان الثالث.',
    ...generateIRTParams(2)
  }
];

// Calculate timesCorrect based on difficulty for realistic calibration
questionsAr.forEach(question => {
  const expectedAccuracy = Math.max(0.1, Math.min(0.9, 0.8 - (question.difficulty - 1) * 0.07));
  question.timesCorrect = Math.floor(question.timesAnswered * expectedAccuracy);
});
