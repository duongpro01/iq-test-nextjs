import { Question, QuestionCategory } from '@/types';

export const questionDatabase: Question[] = [
  // PATTERN RECOGNITION - Difficulty 1-3 (Easy)
  {
    id: 'pr_001',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 1,
    question: 'What comes next in this sequence: 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'The sequence increases by 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10'
  },
  {
    id: 'pr_002',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 2,
    question: 'Complete the pattern: A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Skip one letter each time: A(skip B)C(skip D)E(skip F)G(skip H)I'
  },
  {
    id: 'pr_003',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 3,
    question: 'What number should replace the question mark: 3, 6, 12, 24, ?',
    options: ['36', '48', '42', '30'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'Each number is doubled: 3×2=6, 6×2=12, 12×2=24, 24×2=48'
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
    explanation: 'Fibonacci sequence: each number is the sum of the two preceding ones (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13)'
  },
  {
    id: 'pr_005',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 5,
    question: 'Complete the sequence: 2, 6, 18, 54, ?',
    options: ['108', '162', '216', '270'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162'
  },
  {
    id: 'pr_006',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 6,
    question: 'What comes next: 1, 4, 9, 16, 25, ?',
    options: ['30', '35', '36', '49'],
    correctAnswer: 2,
    timeLimit: 75,
    explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36'
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
    explanation: 'Prime numbers sequence: 2, 3, 5, 7, 11, 13, 17'
  },
  {
    id: 'pr_008',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 8,
    question: 'Complete: 1, 8, 27, 64, 125, ?',
    options: ['196', '216', '256', '343'],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³ = 216'
  },
  {
    id: 'pr_009',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 9,
    question: 'Next in sequence: 0, 1, 1, 2, 3, 5, 8, 13, ?',
    options: ['18', '21', '24', '34'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Extended Fibonacci: 8+13=21'
  },
  {
    id: 'pr_010',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 10,
    question: 'Find the next term: 2, 12, 36, 80, 150, ?',
    options: ['252', '294', '336', '378'],
    correctAnswer: 0,
    timeLimit: 120,
    explanation: 'Formula: n(n+1)(n+2) where n starts at 1: 1×2×3=6×2=12, 2×3×4=24×3=72... Pattern: 2×6=12, 3×12=36, 4×20=80, 5×30=150, 6×42=252'
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
    explanation: 'A triangle by definition has 3 sides'
  },
  {
    id: 'sr_002',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 2,
    question: 'If you rotate a square 90 degrees, what shape do you get?',
    options: ['Rectangle', 'Square', 'Triangle', 'Circle'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Rotating a square 90 degrees still results in a square'
  },
  {
    id: 'sr_003',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 3,
    question: 'How many faces does a cube have?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'A cube has 6 faces: top, bottom, front, back, left, right'
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
    explanation: 'Folding twice creates 4 layers, so one cut creates 4 holes'
  },
  {
    id: 'sr_005',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 5,
    question: 'Which 3D shape has the same number of faces as vertices?',
    options: ['Cube', 'Tetrahedron', 'Octahedron', 'Dodecahedron'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'A tetrahedron has 4 faces and 4 vertices'
  },
  {
    id: 'sr_006',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 6,
    question: 'How many edges does a triangular prism have?',
    options: ['6', '9', '12', '15'],
    correctAnswer: 1,
    timeLimit: 75,
    explanation: 'A triangular prism has 9 edges: 3 on top triangle, 3 on bottom triangle, 3 connecting them'
  },

  // LOGIC - Difficulty 1-3 (Easy)
  {
    id: 'lg_001',
    category: QuestionCategory.LOGIC,
    difficulty: 1,
    question: 'All cats are animals. Fluffy is a cat. Therefore, Fluffy is:',
    options: ['A dog', 'An animal', 'A bird', 'A fish'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'Basic syllogism: If all cats are animals and Fluffy is a cat, then Fluffy must be an animal'
  },
  {
    id: 'lg_002',
    category: QuestionCategory.LOGIC,
    difficulty: 2,
    question: 'If it rains, the ground gets wet. The ground is wet. What can we conclude?',
    options: ['It rained', 'It might have rained', 'It did not rain', 'Nothing definitive'],
    correctAnswer: 3,
    timeLimit: 60,
    explanation: 'This is the logical fallacy of affirming the consequent. The ground could be wet for other reasons (sprinkler, flood, etc.)'
  },
  {
    id: 'lg_003',
    category: QuestionCategory.LOGIC,
    difficulty: 3,
    question: 'Some birds can fly. Penguins are birds. Therefore:',
    options: ['Penguins can fly', 'Penguins cannot fly', 'Some penguins can fly', 'We cannot determine if penguins can fly from this information'],
    correctAnswer: 3,
    timeLimit: 60,
    explanation: '"Some birds can fly" does not mean all birds can fly, so we cannot determine penguin flight ability from this premise alone'
  },

  // LOGIC - Difficulty 4-6 (Medium)
  {
    id: 'lg_004',
    category: QuestionCategory.LOGIC,
    difficulty: 4,
    question: 'In a group of 30 people, 18 like coffee, 15 like tea, and 8 like both. How many like neither?',
    options: ['3', '5', '7', '9'],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Using set theory: Coffee only (18-8=10) + Tea only (15-8=7) + Both (8) = 25. So 30-25=5 like neither'
  },
  {
    id: 'lg_005',
    category: QuestionCategory.LOGIC,
    difficulty: 5,
    question: 'If A implies B, and B implies C, and A is true, what can we conclude about C?',
    options: ['C is true', 'C is false', 'C might be true', 'Nothing about C'],
    correctAnswer: 0,
    timeLimit: 75,
    explanation: 'Transitive property: A→B, B→C, A is true, therefore C is true'
  },
  {
    id: 'lg_006',
    category: QuestionCategory.LOGIC,
    difficulty: 6,
    question: 'Three friends have different colored shirts: red, blue, and green. Alex does not wear red. Blake does not wear blue. If Charlie wears green, what color does Alex wear?',
    options: ['Red', 'Blue', 'Green', 'Cannot determine'],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Charlie wears green, Blake cannot wear blue (so Blake wears red), Alex cannot wear red (so Alex wears blue)'
  },

  // MATH PUZZLES - Difficulty 1-3 (Easy)
  {
    id: 'mp_001',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 1,
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: '15% of 200 = 0.15 × 200 = 30'
  },
  {
    id: 'mp_002',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 2,
    question: 'If x + 5 = 12, what is x?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    timeLimit: 45,
    explanation: 'x + 5 = 12, so x = 12 - 5 = 7'
  },
  {
    id: 'mp_003',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 3,
    question: 'A rectangle has length 8 and width 5. What is its area?',
    options: ['13', '26', '40', '80'],
    correctAnswer: 2,
    timeLimit: 45,
    explanation: 'Area = length × width = 8 × 5 = 40'
  },

  // MATH PUZZLES - Difficulty 4-6 (Medium)
  {
    id: 'mp_004',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 4,
    question: 'If 2x - 3 = 11, what is x?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 3,
    timeLimit: 60,
    explanation: '2x - 3 = 11, so 2x = 14, therefore x = 7'
  },
  {
    id: 'mp_005',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 5,
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    timeLimit: 60,
    explanation: '√144 = 12 because 12² = 144'
  },
  {
    id: 'mp_006',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 6,
    question: 'If a train travels 120 miles in 2 hours, what is its average speed in miles per hour?',
    options: ['50', '55', '60', '65'],
    correctAnswer: 2,
    timeLimit: 75,
    explanation: 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 mph'
  },

  // SHORT-TERM MEMORY - Difficulty 1-3 (Easy)
  {
    id: 'stm_001',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 1,
    question: 'Remember this sequence: 3, 7, 2. What was the second number?',
    options: ['2', '3', '7', '9'],
    correctAnswer: 2,
    timeLimit: 30,
    explanation: 'The sequence was 3, 7, 2. The second number was 7'
  },
  {
    id: 'stm_002',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 2,
    question: 'Study these words: CAT, DOG, BIRD, FISH. Which word was third?',
    options: ['CAT', 'DOG', 'BIRD', 'FISH'],
    correctAnswer: 2,
    timeLimit: 45,
    explanation: 'The sequence was CAT, DOG, BIRD, FISH. BIRD was the third word'
  },
  {
    id: 'stm_003',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 3,
    question: 'Remember: RED CIRCLE, BLUE SQUARE, GREEN TRIANGLE. What shape was blue?',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'BLUE was paired with SQUARE'
  },

  // Additional questions for higher difficulties...
  // PATTERN RECOGNITION - More difficult
  {
    id: 'pr_011',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 8,
    question: 'Find the next number: 1, 11, 21, 1211, 111221, ?',
    options: ['312211', '13112221', '1113213211', '31131211'],
    correctAnswer: 0,
    timeLimit: 120,
    explanation: 'Look-and-say sequence: describe what you see. 1→"one 1"→11→"two 1s"→21→"one 2, one 1"→1211, etc. Next: "three 1s, two 2s, one 1" = 312211'
  },

  // SPATIAL REASONING - More difficult
  {
    id: 'sr_007',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 7,
    question: 'A cube is painted red on all faces, then cut into 27 smaller cubes. How many small cubes have exactly 2 red faces?',
    options: ['8', '12', '6', '0'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Edge cubes (not corners) have exactly 2 faces painted. A 3×3×3 cube has 12 edge cubes'
  },

  // LOGIC - More difficult
  {
    id: 'lg_007',
    category: QuestionCategory.LOGIC,
    difficulty: 7,
    question: 'Five houses in a row are painted different colors. The red house is immediately to the left of the blue house. The green house is at one end. The yellow house is between the white and green houses. What color is the middle house?',
    options: ['Red', 'Blue', 'Yellow', 'White'],
    correctAnswer: 2,
    timeLimit: 150,
    explanation: 'Working through the constraints: Green must be at an end, yellow between white and green. The arrangement is Green-White-Yellow-Red-Blue, so Yellow is in the middle'
  },

  // MATH PUZZLES - More difficult
  {
    id: 'mp_007',
    category: QuestionCategory.MATH_PUZZLES,
    difficulty: 7,
    question: 'If x² - 5x + 6 = 0, what are the possible values of x?',
    options: ['2 and 3', '1 and 6', '-2 and -3', '5 and 1'],
    correctAnswer: 0,
    timeLimit: 120,
    explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3'
  },

  // SHORT-TERM MEMORY - More difficult
  {
    id: 'stm_004',
    category: QuestionCategory.SHORT_TERM_MEMORY,
    difficulty: 4,
    question: 'Remember this sequence: 7, 3, 9, 1, 5, 8, 2. What is the sum of the 2nd and 5th numbers?',
    options: ['6', '8', '10', '12'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'The sequence was 7, 3, 9, 1, 5, 8, 2. The 2nd number is 3, the 5th is 5. Sum: 3 + 5 = 8'
  }
];

// Helper function to get questions by difficulty level
export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return questionDatabase.filter(q => q.difficulty === difficulty);
}

// Helper function to get questions by category
export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return questionDatabase.filter(q => q.category === category);
}

// Helper function to organize questions into pools by difficulty
export function organizeQuestionPools(): Record<number, Question[]> {
  const pools: Record<number, Question[]> = {};
  
  for (let i = 1; i <= 10; i++) {
    pools[i] = getQuestionsByDifficulty(i);
  }
  
  return pools;
} 