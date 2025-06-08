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

export const questionsFr: Question[] = [
  // PATTERN RECOGNITION - Difficulty 1-3 (Easy)
  {
    id: 'pr_001',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 1,
    question: 'Que vient ensuite dans cette séquence : 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'La séquence augmente de 2 à chaque fois : 2+2=4, 4+2=6, 6+2=8, 8+2=10',
    ...generateIRTParams(1)
  },
  {
    id: 'pr_002',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 2,
    question: 'Complétez le motif : A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Sautez une lettre à chaque fois : A(sauter B)C(sauter D)E(sauter F)G(sauter H)I',
    ...generateIRTParams(2)
  },
  {
    id: 'pr_003',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 3,
    question: 'Quel nombre doit remplacer le point d\'interrogation : 3, 6, 12, 24, ?',
    options: ['36', '48', '42', '30'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'Chaque nombre est doublé : 3×2=6, 6×2=12, 12×2=24, 24×2=48',
    ...generateIRTParams(3)
  },
  {
    id: 'pr_004',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 4,
    question: 'Trouvez le terme suivant : 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '13', '15', '16'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'Suite de Fibonacci : chaque nombre est la somme des deux précédents (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13)',
    ...generateIRTParams(4)
  },
  {
    id: 'pr_005',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 5,
    question: 'Complétez la séquence : 2, 6, 18, 54, ?',
    options: ['108', '162', '216', '270'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'Chaque nombre est multiplié par 3 : 2×3=6, 6×3=18, 18×3=54, 54×3=162',
    ...generateIRTParams(5)
  },

  // SPATIAL REASONING - Difficulty 1-3 (Easy)
  {
    id: 'sr_001',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 1,
    question: 'Combien de côtés a un triangle ?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: 'Un triangle a par définition 3 côtés',
    ...generateIRTParams(1)
  },
  {
    id: 'sr_002',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 2,
    question: 'Si vous faites tourner un carré de 90 degrés, quelle forme obtenez-vous ?',
    options: ['Rectangle', 'Carré', 'Triangle', 'Cercle'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Faire tourner un carré de 90 degrés donne toujours un carré',
    ...generateIRTParams(2)
  },
  {
    id: 'sr_003',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 3,
    question: 'Combien de faces a un cube ?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Un cube a 6 faces : haut, bas, avant, arrière, gauche, droite',
    ...generateIRTParams(3)
  },

  // LOGICAL DEDUCTION - Difficulty 1-3 (Easy)
  {
    id: 'lg_001',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 1,
    question: 'Tous les chats sont des animaux. Fluffy est un chat. Donc :',
    options: ['Fluffy est un animal', 'Fluffy n\'est pas un animal', 'Certains chats sont des animaux', 'On ne peut pas le déterminer'],
    correctAnswer: 0,
    timeLimit: 45,
    explanation: 'C\'est une déduction logique valide : tous les chats sont des animaux, Fluffy est un chat, donc Fluffy est un animal',
    ...generateIRTParams(1)
  },
  {
    id: 'lg_002',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 2,
    question: 'Si aujourd\'hui c\'est mardi, demain ce sera :',
    options: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'],
    correctAnswer: 2,
    timeLimit: 30,
    explanation: 'Si aujourd\'hui c\'est mardi, demain ce sera mercredi',
    ...generateIRTParams(2)
  },

  // NUMERICAL REASONING - Difficulty 1-3 (Easy)
  {
    id: 'nr_001',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 1,
    question: 'Combien font 15% de 100 ?',
    options: ['10', '15', '20', '25'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: '15% de 100 = 15/100 × 100 = 15',
    ...generateIRTParams(1)
  },
  {
    id: 'nr_002',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 2,
    question: 'Si x + 5 = 12, que vaut x ?',
    options: ['5', '7', '17', '60'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'x + 5 = 12, donc x = 12 - 5 = 7',
    ...generateIRTParams(2)
  },

  // SHORT-TERM MEMORY - Difficulty 1-2 (Easy)
  {
    id: 'sm_001',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 1,
    question: 'Retenez cette séquence : 3, 7, 1. Quel était le deuxième nombre ?',
    options: ['3', '7', '1', '4'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: 'La séquence était 3, 7, 1. Le deuxième nombre était 7.',
    ...generateIRTParams(1)
  },
  {
    id: 'sm_002',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 2,
    question: 'Étudiez cette liste : CHAT, CHIEN, OISEAU, POISSON. Quel animal était le troisième ?',
    options: ['CHAT', 'CHIEN', 'OISEAU', 'POISSON'],
    correctAnswer: 2,
    timeLimit: 45,
    explanation: 'La liste était CHAT, CHIEN, OISEAU, POISSON. OISEAU était le troisième animal.',
    ...generateIRTParams(2)
  }
];

// Calculate timesCorrect based on difficulty for realistic calibration
questionsFr.forEach(question => {
  const expectedAccuracy = Math.max(0.1, Math.min(0.9, 0.8 - (question.difficulty - 1) * 0.07));
  question.timesCorrect = Math.floor(question.timesAnswered * expectedAccuracy);
}); 