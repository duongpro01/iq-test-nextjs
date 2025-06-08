import { Question, QuestionCategory } from '@/types';

// Helper function to generate IRT parameters based on difficulty
const generateIRTParams = (difficulty: number) => {
  // Map difficulty (1-10) to IRT parameters
  const difficultyToB = (diff: number) => (diff - 5.5) * 0.6; // Maps 1-10 to roughly -2.7 to +2.7
  const difficultyToA = (diff: number) => 0.8 + (diff / 10) * 1.4; // Maps 1-10 to 0.8-2.2 discrimination
  
  return {
    a: Number((difficultyToA(difficulty)).toFixed(2)), // discrimination
    b: Number((difficultyToB(difficulty)).toFixed(2)), // difficulty in logits
    c: 0.25, // guessing parameter for 4-option MCQ
    timesAnswered: Math.floor(Math.random() * 1000) + 100, // Simulated calibration data
    timesCorrect: 0, // Will be calculated
    averageResponseTime: 30000 + (difficulty * 5000), // Harder questions take longer
    lastCalibrated: new Date()
  };
};

export const questions: Question[] = [
  // PATTERN RECOGNITION - Difficulty 1-3 (Easy)
  {
    id: 'pr_001',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 1,
    question: 'What comes next in this sequence: 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'The sequence increases by 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10',
    ...generateIRTParams(1)
  },
  {
    id: 'pr_002',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 2,
    question: 'Complete the pattern: A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Skip one letter each time: A(skip B)C(skip D)E(skip F)G(skip H)I',
    ...generateIRTParams(2)
  },
  {
    id: 'pr_003',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 3,
    question: 'What number should replace the question mark: 3, 6, 12, 24, ?',
    options: ['36', '48', '42', '30'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'Each number is doubled: 3×2=6, 6×2=12, 12×2=24, 24×2=48',
    ...generateIRTParams(3)
  },

  // PATTERN RECOGNITION - Difficulty 4-6 (Medium)
  {
    id: 'pr_004',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 4,
    question: 'Find the next term: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '13', '15', '16'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'Fibonacci sequence: each number is the sum of the two preceding ones (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13)',
    ...generateIRTParams(4)
  },
  {
    id: 'pr_005',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 5,
    question: 'Complete the sequence: 2, 6, 18, 54, ?',
    options: ['108', '162', '216', '270'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162',
    ...generateIRTParams(5)
  },
  {
    id: 'pr_006',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 6,
    question: 'What comes next: 1, 4, 9, 16, 25, ?',
    options: ['30', '35', '36', '49'],
    correctAnswer: 2,
    timeLimit: 75,
    explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36',
    ...generateIRTParams(6)
  },

  // PATTERN RECOGNITION - Difficulty 7-10 (Hard)
  {
    id: 'pr_007',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 7,
    question: 'Find the pattern: 2, 3, 5, 7, 11, 13, ?',
    options: ['15', '17', '19', '21'],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Prime numbers sequence: 2, 3, 5, 7, 11, 13, 17',
    ...generateIRTParams(7)
  },
  {
    id: 'pr_008',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 8,
    question: 'Complete: 1, 8, 27, 64, 125, ?',
    options: ['196', '216', '256', '343'],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³ = 216',
    ...generateIRTParams(8)
  },
  {
    id: 'pr_009',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 9,
    question: 'Next in sequence: 0, 1, 1, 2, 3, 5, 8, 13, ?',
    options: ['18', '21', '24', '34'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Extended Fibonacci: 8+13=21',
    ...generateIRTParams(9)
  },
  {
    id: 'pr_010',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 10,
    question: 'Find the next term: 2, 12, 36, 80, 150, ?',
    options: ['252', '294', '336', '378'],
    correctAnswer: 0,
    timeLimit: 120,
    explanation: 'Formula: n(n+1)(n+2) where n starts at 1: 1×2×3=6×2=12, 2×3×4=24×3=72... Pattern: 2×6=12, 3×12=36, 4×20=80, 5×30=150, 6×42=252',
    ...generateIRTParams(10)
  },

  // SPATIAL REASONING - Difficulty 1-3 (Easy)
  {
    id: 'sr_001',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 1,
    question: 'How many sides does a triangle have?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: 'A triangle by definition has 3 sides',
    ...generateIRTParams(1)
  },
  {
    id: 'sr_002',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 2,
    question: 'If you rotate a square 90 degrees, what shape do you get?',
    options: ['Rectangle', 'Square', 'Triangle', 'Circle'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Rotating a square 90 degrees still results in a square',
    ...generateIRTParams(2)
  },
  {
    id: 'sr_003',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 3,
    question: 'How many faces does a cube have?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'A cube has 6 faces: top, bottom, front, back, left, right',
    ...generateIRTParams(3)
  },

  // SPATIAL REASONING - Difficulty 4-6 (Medium)
  {
    id: 'sr_004',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 4,
    question: 'If you fold a piece of paper in half twice and cut a hole, how many holes will there be when unfolded?',
    options: ['2', '4', '6', '8'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'Folding twice creates 4 layers, so one cut creates 4 holes',
    ...generateIRTParams(4)
  },
  {
    id: 'sr_005',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 5,
    question: 'Which 3D shape has the same number of faces as vertices?',
    options: ['Cube', 'Tetrahedron', 'Octahedron', 'Dodecahedron'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'A tetrahedron has 4 faces and 4 vertices',
    ...generateIRTParams(5)
  },
  {
    id: 'sr_006',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 6,
    question: 'How many edges does a triangular prism have?',
    options: ['6', '9', '12', '15'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'A triangular prism has 9 edges: 3 on top triangle, 3 on bottom triangle, 3 connecting them',
    ...generateIRTParams(6)
  },

  // LOGICAL DEDUCTION - Difficulty 1-3 (Easy)
  {
    id: 'lg_001',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 1,
    question: 'All cats are animals. Fluffy is a cat. Therefore, Fluffy is:',
    options: ['A dog', 'An animal', 'A bird', 'A fish'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Basic syllogism: If all cats are animals and Fluffy is a cat, then Fluffy must be an animal',
    ...generateIRTParams(1)
  },
  {
    id: 'lg_002',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 2,
    question: 'If it rains, the ground gets wet. The ground is wet. What can we conclude?',
    options: ['It rained', 'It might have rained', 'It did not rain', 'Nothing definitive'],
    correctAnswer: 3,
    timeLimit: 60,
    explanation: 'This is the logical fallacy of affirming the consequent. The ground could be wet for other reasons (sprinkler, flood, etc.)',
    ...generateIRTParams(2)
  },
  {
    id: 'lg_003',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 3,
    question: 'Some birds can fly. Penguins are birds. Therefore:',
    options: ['Penguins can fly', 'Penguins cannot fly', 'Some penguins can fly', 'We cannot determine if penguins can fly from this information'],
    correctAnswer: 3,
    timeLimit: 60,
    explanation: 'The premise only states that SOME birds can fly, not ALL birds. We cannot conclude anything definitive about penguins from this information alone.',
    ...generateIRTParams(3)
  },

  // NUMERICAL REASONING - Difficulty 1-3 (Easy)
  {
    id: 'nr_001',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 1,
    question: 'What is 15% of 100?',
    options: ['10', '15', '20', '25'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: '15% of 100 = 15/100 × 100 = 15',
    ...generateIRTParams(1)
  },
  {
    id: 'nr_002',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 2,
    question: 'If x + 5 = 12, what is x?',
    options: ['5', '7', '17', '60'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'x + 5 = 12, so x = 12 - 5 = 7',
    ...generateIRTParams(2)
  },
  {
    id: 'nr_003',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 3,
    question: 'A shirt costs $20. If there is a 25% discount, what is the final price?',
    options: ['$15', '$16', '$18', '$5'],
    correctAnswer: 0,
    timeLimit: 60,
    explanation: '25% discount means you pay 75% of the original price: 20 × 0.75 = $15',
    ...generateIRTParams(3)
  },

  // SHORT-TERM MEMORY - Difficulty 1-3 (Easy)
  {
    id: 'sm_001',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 1,
    question: 'Remember this sequence: 3, 7, 1. What was the second number?',
    options: ['3', '7', '1', '4'],
    correctAnswer: 1,
    timeLimit: 30,
    explanation: 'The sequence was 3, 7, 1. The second number was 7.',
    ...generateIRTParams(1)
  },
  {
    id: 'sm_002',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 2,
    question: 'Study this list: CAT, DOG, BIRD, FISH. Which animal was third?',
    options: ['CAT', 'DOG', 'BIRD', 'FISH'],
    correctAnswer: 2,
    timeLimit: 45,
    explanation: 'The list was CAT, DOG, BIRD, FISH. BIRD was the third animal.',
    ...generateIRTParams(2)
  },
  {
    id: 'sm_003',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 3,
    question: 'Remember: RED-BLUE-GREEN-YELLOW-PURPLE. What color came after GREEN?',
    options: ['RED', 'BLUE', 'YELLOW', 'PURPLE'],
    correctAnswer: 2,
    timeLimit: 60,
    explanation: 'The sequence was RED-BLUE-GREEN-YELLOW-PURPLE. YELLOW came after GREEN.',
    ...generateIRTParams(3)
  },

  // Additional questions for comprehensive coverage (continuing pattern for all categories and difficulties)
  // PATTERN RECOGNITION - More questions
  {
    id: 'pr_011',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 4,
    question: 'What comes next: 100, 50, 25, 12.5, ?',
    options: ['6.25', '6', '5', '10'],
    correctAnswer: 0,
    timeLimit: 60,
    explanation: 'Each number is divided by 2: 100÷2=50, 50÷2=25, 25÷2=12.5, 12.5÷2=6.25',
    ...generateIRTParams(4)
  },
  {
    id: 'pr_012',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 5,
    question: 'Complete the pattern: 1, 3, 7, 15, 31, ?',
    options: ['47', '63', '95', '127'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'Pattern: multiply by 2 and add 1: 1×2+1=3, 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63',
    ...generateIRTParams(5)
  },

  // SPATIAL REASONING - More questions
  {
    id: 'sr_007',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 7,
    question: 'A cube is painted red on all faces, then cut into 27 smaller cubes. How many small cubes have exactly 2 red faces?',
    options: ['8', '12', '6', '0'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'In a 3×3×3 cube, the edge cubes (not corners or face centers) have exactly 2 painted faces. There are 12 edges with 1 cube each = 12 cubes.',
    ...generateIRTParams(7)
  },
  {
    id: 'sr_008',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 8,
    question: 'If you unfold a cube, which of these could NOT be the resulting pattern?',
    options: ['Cross shape', 'T shape', 'Straight line of 6 squares', 'L shape with 4 squares'],
    correctAnswer: 3,
    timeLimit: 120,
    explanation: 'An L shape with only 4 squares cannot form a cube, which requires 6 faces.',
    ...generateIRTParams(8)
  },

  // LOGICAL DEDUCTION - More questions
  {
    id: 'lg_004',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 4,
    question: 'All roses are flowers. Some flowers are red. Therefore:',
    options: ['All roses are red', 'Some roses are red', 'No roses are red', 'We cannot determine the color of roses'],
    correctAnswer: 3,
    timeLimit: 75,
    explanation: 'We know all roses are flowers and some flowers are red, but we cannot determine if any roses are among the red flowers.',
    ...generateIRTParams(4)
  },
  {
    id: 'lg_005',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 5,
    question: 'If A implies B, and B implies C, and A is true, what can we conclude about C?',
    options: ['C is true', 'C is false', 'C might be true', 'Nothing about C'],
    correctAnswer: 0,
    timeLimit: 90,
    explanation: 'This is a valid logical chain: A→B, B→C, A is true, therefore B is true, therefore C is true.',
    ...generateIRTParams(5)
  },

  // NUMERICAL REASONING - More questions
  {
    id: 'nr_004',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 4,
    question: 'If 3x - 7 = 14, what is the value of x?',
    options: ['5', '7', '21', '3'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: '3x - 7 = 14, so 3x = 21, therefore x = 7',
    ...generateIRTParams(4)
  },
  {
    id: 'nr_005',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 5,
    question: 'A train travels 240 miles in 4 hours. What is its average speed in miles per hour?',
    options: ['40 mph', '50 mph', '60 mph', '80 mph'],
    correctAnswer: 2,
    timeLimit: 75,
    explanation: 'Speed = Distance ÷ Time = 240 ÷ 4 = 60 mph',
    ...generateIRTParams(5)
  },

  // SHORT-TERM MEMORY - More questions
  {
    id: 'sm_004',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 4,
    question: 'Memorize: 8-3-9-1-5-7. What is the sum of the first and last numbers?',
    options: ['13', '15', '16', '12'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'First number: 8, Last number: 7, Sum: 8 + 7 = 15',
    ...generateIRTParams(4)
  },
  {
    id: 'sm_005',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 5,
    question: 'Study this grid: [A1][B2][C3] / [D4][E5][F6]. What letter is paired with number 4?',
    options: ['A', 'D', 'E', 'F'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'In the grid, D is paired with 4: [D4]',
    ...generateIRTParams(5)
  }
];

// Calculate timesCorrect based on difficulty for realistic calibration
questions.forEach(question => {
  const expectedAccuracy = Math.max(0.1, Math.min(0.9, 0.8 - (question.difficulty - 1) * 0.07));
  question.timesCorrect = Math.floor(question.timesAnswered * expectedAccuracy);
});

export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return questions.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return questions.filter(q => q.category === category);
}

export function organizeQuestionPools(): Record<number, Question[]> {
  const pools: Record<number, Question[]> = {};
  for (let i = 1; i <= 10; i++) {
    pools[i] = getQuestionsByDifficulty(i);
  }
  return pools;
}

// Export for backward compatibility
export const questionDatabase = questions; 