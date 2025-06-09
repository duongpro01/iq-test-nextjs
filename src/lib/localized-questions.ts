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
  },
  // Additional Pattern Recognition questions
  'pr_005': {
    question: 'أكمل التسلسل: 2، 6، 18، 54، ؟',
    options: ['108', '162', '216', '270'],
    explanation: 'كل رقم يتم ضربه في 3: 2×3=6، 6×3=18، 18×3=54، 54×3=162'
  },
  'pr_006': {
    question: 'ما التالي: 1، 4، 9، 16، 25، ؟',
    options: ['30', '35', '36', '49'],
    explanation: 'مربعات كاملة: 1²، 2²، 3²، 4²، 5²، 6² = 36'
  },
  'pr_007': {
    question: 'اعثر على النمط: 2، 3، 5، 7، 11، 13، ؟',
    options: ['15', '17', '19', '21'],
    explanation: 'تسلسل الأرقام الأولية: 2، 3، 5، 7، 11، 13، 17'
  },
  'pr_008': {
    question: 'أكمل: 1، 8، 27، 64، 125، ؟',
    options: ['196', '216', '256', '343'],
    explanation: 'مكعبات كاملة: 1³، 2³، 3³، 4³، 5³، 6³ = 216'
  },
  // Additional Spatial Reasoning questions
  'sr_004': {
    question: 'إذا طويت ورقة نصفين مرتين وقطعت ثقباً، كم ثقباً ستجد عند فتحها؟',
    options: ['2', '4', '6', '8'],
    explanation: 'الطي مرتين ينشئ 4 طبقات، لذا قطع واحد ينشئ 4 ثقوب'
  },
  'sr_005': {
    question: 'أي شكل ثلاثي الأبعاد له نفس عدد الوجوه والرؤوس؟',
    options: ['مكعب', 'رباعي الوجوه', 'ثماني الوجوه', 'اثني عشري الوجوه'],
    explanation: 'رباعي الوجوه له 4 وجوه و 4 رؤوس'
  },
  'sr_006': {
    question: 'كم حافة للمنشور الثلاثي؟',
    options: ['6', '9', '12', '15'],
    explanation: 'المنشور الثلاثي له 9 حواف: 3 في القاعدة العلوية، 3 في السفلية، 3 تصل بينهما'
  },
  // Additional Logical Deduction questions
  'lg_003': {
    question: 'إذا كان جميع الطلاب يدرسون، وماريا طالبة، فإن:',
    options: ['ماريا تدرس', 'ماريا لا تدرس', 'بعض الطلاب يدرسون', 'لا يمكن تحديد ذلك'],
    explanation: 'استنتاج منطقي صحيح: جميع الطلاب يدرسون، ماريا طالبة، إذن ماريا تدرس'
  },
  'lg_004': {
    question: 'جميع الورود أزهار. بعض الأزهار حمراء. إذن:',
    options: ['جميع الورود حمراء', 'بعض الورود حمراء', 'لا توجد ورود حمراء', 'لا يمكن تحديد لون الورود'],
    explanation: 'نعلم أن جميع الورود أزهار وبعض الأزهار حمراء، لكن لا يمكن تحديد ما إذا كانت أي من الورود من بين الأزهار الحمراء'
  },
  'lg_005': {
    question: 'إذا كان أ يستلزم ب، وب يستلزم ج، وأ صحيح، فماذا يمكن أن نستنتج عن ج؟',
    options: ['ج صحيح', 'ج خاطئ', 'ج قد يكون صحيحاً', 'لا شيء عن ج'],
    explanation: 'هذه سلسلة منطقية صحيحة: أ→ب، ب→ج، أ صحيح، إذن ب صحيح، إذن ج صحيح'
  },
  // Additional Numerical Reasoning questions
  'nr_003': {
    question: 'قميص يكلف 20 دولاراً. إذا كان هناك خصم 25%، فما السعر النهائي؟',
    options: ['15 دولاراً', '16 دولاراً', '18 دولاراً', '5 دولارات'],
    explanation: 'خصم 25% يعني أنك تدفع 75% من السعر الأصلي: 20 × 0.75 = 15 دولاراً'
  },
  'nr_004': {
    question: 'إذا كان 3س - 7 = 14، فما قيمة س؟',
    options: ['5', '7', '21', '3'],
    explanation: '3س - 7 = 14، إذن 3س = 21، لذلك س = 7'
  },
  'nr_005': {
    question: 'قطار يسافر 240 ميلاً في 4 ساعات. ما متوسط سرعته بالميل في الساعة؟',
    options: ['40 ميل/ساعة', '50 ميل/ساعة', '60 ميل/ساعة', '80 ميل/ساعة'],
    explanation: 'السرعة = المسافة ÷ الوقت = 240 ÷ 4 = 60 ميل/ساعة'
  },
  // Additional Short-term Memory questions
  'sm_003': {
    question: 'تذكر: أحمر-أزرق-أخضر-أصفر-بنفسجي. أي لون جاء بعد الأخضر؟',
    options: ['أحمر', 'أزرق', 'أصفر', 'بنفسجي'],
    explanation: 'التسلسل كان أحمر-أزرق-أخضر-أصفر-بنفسجي. الأصفر جاء بعد الأخضر'
  },
  'sm_004': {
    question: 'احفظ: 8-3-9-1-5-7. ما مجموع الرقم الأول والأخير؟',
    options: ['13', '15', '16', '12'],
    explanation: 'الرقم الأول: 8، الرقم الأخير: 7، المجموع: 8 + 7 = 15'
  },
  'sm_005': {
    question: 'ادرس هذه الشبكة: [أ1][ب2][ج3] / [د4][هـ5][و6]. أي حرف مقترن بالرقم 4؟',
    options: ['أ', 'د', 'هـ', 'و'],
    explanation: 'في الشبكة، د مقترن بـ 4: [د4]'
  },
  // Additional advanced questions
  'pr_009': {
    question: 'التالي في التسلسل: 0، 1، 1، 2، 3، 5، 8، 13، ؟',
    options: ['18', '21', '24', '34'],
    explanation: 'فيبوناتشي الممتد: 8+13=21'
  },
  'pr_010': {
    question: 'اعثر على الحد التالي: 2، 12، 36، 80، 150، ؟',
    options: ['252', '294', '336', '378'],
    explanation: 'الصيغة: ن(ن+1)(ن+2) حيث ن تبدأ من 1: 6×42=252'
  },
  'pr_011': {
    question: 'ما التالي: 100، 50، 25، 12.5، ؟',
    options: ['6.25', '6', '5', '10'],
    explanation: 'كل رقم يقسم على 2: 100÷2=50، 50÷2=25، 25÷2=12.5، 12.5÷2=6.25'
  },
  'pr_012': {
    question: 'أكمل النمط: 1، 3، 7، 15، 31، ؟',
    options: ['47', '63', '95', '127'],
    explanation: 'النمط: اضرب في 2 واجمع 1: 1×2+1=3، 3×2+1=7، 7×2+1=15، 15×2+1=31، 31×2+1=63'
  },
  'sr_007': {
    question: 'مكعب مطلي بالأحمر على جميع الوجوه، ثم مقطع إلى 27 مكعباً أصغر. كم مكعباً صغيراً له وجهان أحمران بالضبط؟',
    options: ['8', '12', '6', '0'],
    explanation: 'في مكعب 3×3×3، المكعبات الحافية (ليست زوايا أو مراكز وجوه) لها وجهان مطليان بالضبط. هناك 12 حافة بمكعب واحد لكل منها = 12 مكعباً'
  },
  'sr_008': {
    question: 'إذا فتحت مكعباً، أي من هذه الأنماط لا يمكن أن يكون النتيجة؟',
    options: ['شكل صليب', 'شكل T', 'خط مستقيم من 6 مربعات', 'شكل L بـ 4 مربعات'],
    explanation: 'شكل L بـ 4 مربعات فقط لا يمكن أن يشكل مكعباً، الذي يتطلب 6 وجوه'
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
  console.log('getLocalizedQuestions called with locale:', normalizedLocale);
  
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
      console.log(`Found translation for ${question.id} in ${normalizedLocale}:`, localizedContent.question);
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
  console.log('getLocalizedQuestion called with:', { questionId, locale });
  const localizedQuestions = getLocalizedQuestions(locale);
  const result = localizedQuestions.find(q => q.id === questionId) || null;
  console.log('getLocalizedQuestion result:', result ? 'Found translation' : 'No translation found');
  if (result) {
    console.log('Translated question text:', result.question);
  }
  return result;
}
