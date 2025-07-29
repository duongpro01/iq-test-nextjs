import { Question, QuestionCategory, TaskType, MatrixPattern, BlockDesignTask, VisualPuzzleTask, TaskData } from '@/types';

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
  // TRADITIONAL ENHANCED QUESTIONS (with proper options and answers)
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
    question: 'Complete the pattern: 1, 3, 6, 10, ?',
    options: ['14', '15', '16', '17'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'The difference increases by 1: 1+2=3, 3+3=6, 6+4=10, 10+5=15',
    ...generateIRTParams(2)
  },
  {
    id: 'pr_003',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 3,
    question: 'What comes next: A, C, F, J, ?',
    options: ['M', 'N', 'O', 'P'],
    correctAnswer: 2,
    timeLimit: 90,
    explanation: 'Skip 1, 2, 3, 4 letters: A→C→F→J→O',
    ...generateIRTParams(3)
  },
  {
    id: 'vc_001',
    category: QuestionCategory.VERBAL_COMPREHENSION,
    difficulty: 2,
    question: 'What do these words have in common: Apple, Orange, Banana?',
    options: ['They are round', 'They are fruits', 'They are sweet', 'They are colorful'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'All three items are types of fruit',
    ...generateIRTParams(2)
  },
  {
    id: 'vc_002',
    category: QuestionCategory.VERBAL_COMPREHENSION,
    difficulty: 3,
    question: 'Which word does not belong: Car, Bus, Train, Bicycle?',
    options: ['Car', 'Bus', 'Train', 'Bicycle'],
    correctAnswer: 3,
    timeLimit: 90,
    explanation: 'Bicycle is the only non-motorized vehicle',
    ...generateIRTParams(3)
  },
  {
    id: 'nr_001',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 3,
    question: 'If a train travels 120 miles in 2 hours, what is its average speed?',
    options: ['40 mph', '50 mph', '60 mph', '80 mph'],
    correctAnswer: 2,
    timeLimit: 90,
    explanation: 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 mph',
    ...generateIRTParams(3)
  },
  {
    id: 'nr_002',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 4,
    question: 'If 3 workers can complete a task in 8 hours, how long would 6 workers take?',
    options: ['2 hours', '4 hours', '6 hours', '8 hours'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'More workers = less time. 6 workers = 3 workers × 2, so time = 8 ÷ 2 = 4 hours',
    ...generateIRTParams(4)
  },
  {
    id: 'lg_001',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 3,
    question: 'All roses are flowers. Some flowers are red. Therefore:',
    options: ['All roses are red', 'Some roses are red', 'No roses are red', 'We cannot determine the color of roses from this information'],
    correctAnswer: 3,
    timeLimit: 90,
    explanation: 'The premises do not provide enough information to determine rose colors definitively',
    ...generateIRTParams(3)
  },
  {
    id: 'lg_002',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 4,
    question: 'If all A are B, and some B are C, then:',
    options: ['All A are C', 'Some A are C', 'No A are C', 'We cannot determine the relationship between A and C'],
    correctAnswer: 3,
    timeLimit: 120,
    explanation: 'The premises do not provide enough information to determine the A-C relationship',
    ...generateIRTParams(4)
  },
  {
    id: 'sp_001',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 2,
    question: 'Which shape would complete the pattern?',
    options: ['Triangle', 'Square', 'Circle', 'Diamond'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'The pattern alternates between square and triangle',
    ...generateIRTParams(2)
  },
  {
    id: 'sp_002',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 3,
    question: 'If you fold a cube, which face would be opposite to the top?',
    options: ['Front', 'Back', 'Bottom', 'Side'],
    correctAnswer: 2,
    timeLimit: 90,
    explanation: 'In a cube, the face opposite to the top is the bottom',
    ...generateIRTParams(3)
  },
  {
    id: 'wm_001',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 2,
    question: 'Remember this sequence: 4-7-2-9. What was the second number?',
    options: ['4', '7', '2', '9'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'The sequence was 4-7-2-9, so the second number is 7',
    ...generateIRTParams(2)
  },
  {
    id: 'wm_002',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 3,
    question: 'Remember: Blue-Red-Green-Yellow. What color was third?',
    options: ['Blue', 'Red', 'Green', 'Yellow'],
    correctAnswer: 2,
    timeLimit: 90,
    explanation: 'The sequence was Blue-Red-Green-Yellow, so the third color is Green',
    ...generateIRTParams(3)
  },
  {
    id: 'ps_001',
    category: QuestionCategory.PROCESSING_SPEED,
    difficulty: 2,
    question: 'How many times does the letter "E" appear in: ELEPHANT?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'The letter "E" appears twice in ELEPHANT',
    ...generateIRTParams(2)
  },

  // INTERACTIVE TASKS (with proper taskData but no traditional options)
  {
    id: 'mx_001',
    category: QuestionCategory.MATRIX_REASONING,
    difficulty: 2,
    question: 'Complete the matrix by finding the missing pattern',
    options: ['9', '0', '7', '6'],
    correctAnswer: 0,
    timeLimit: 90,
    explanation: 'Look for numerical sequences across rows and columns',
    taskType: TaskType.MATRIX_COMPLETION,
    taskData: {
      matrixPattern: {
        grid: [
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', null]
        ],
        missingIndex: [2, 2],
        options: ['9', '0', '7', '6'],
        correctOption: 0,
        pattern: 'sequence'
      }
    },
    ...generateIRTParams(2)
  },
  {
    id: 'mx_002',
    category: QuestionCategory.MATRIX_REASONING,
    difficulty: 4,
    question: 'Find the missing element in this rotation pattern',
    options: ['▲', '▶', '▼', '◀'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Each row rotates the previous pattern by 90 degrees',
    taskType: TaskType.MATRIX_COMPLETION,
    taskData: {
      matrixPattern: {
        grid: [
          ['▲', '▶', '▼'],
          ['◀', '▲', '▶'],
          ['▼', '◀', null]
        ],
        missingIndex: [2, 2],
        options: ['▲', '▶', '▼', '◀'],
        correctOption: 1,
        pattern: 'rotation'
      }
    },
    ...generateIRTParams(4)
  },
  {
    id: 'bd_001',
    category: QuestionCategory.BLOCK_DESIGN,
    difficulty: 3,
    question: 'Recreate the target design using the colored blocks',
    options: ['Pattern A', 'Pattern B', 'Pattern C', 'Pattern D'],
    correctAnswer: 1,
    timeLimit: 180,
    explanation: 'Use the red and blue blocks to match the target pattern',
    taskType: TaskType.BLOCK_ASSEMBLY,
    taskData: {
      blockDesign: {
        targetPattern: [
          [1, 2],
          [2, 1]
        ],
        blockCount: 4,
        blockTypes: [
          { id: 'red', faces: ['red', 'red', 'red', 'red', 'red', 'red'], rotations: [0, 90, 180, 270] },
          { id: 'blue', faces: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue'], rotations: [0, 90, 180, 270] }
        ],
        rotationAllowed: true,
        timeLimit: 180
      }
    },
    ...generateIRTParams(3)
  },
  {
    id: 'vp_001',
    category: QuestionCategory.VISUAL_PUZZLES,
    difficulty: 3,
    question: 'Select the three pieces that would complete this visual puzzle',
    options: ['Pieces A,B,C', 'Pieces A,B,D', 'Pieces A,C,D', 'Pieces B,C,D'],
    correctAnswer: 0,
    timeLimit: 120,
    explanation: 'Look for pieces that fit together to form the target shape',
    taskType: TaskType.VISUAL_PUZZLE,
    taskData: {
      visualPuzzle: {
        completedImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM4QjVDRjYiLz48L3N2Zz4=',
        pieces: [
          { id: 'A', shape: 'triangle', rotation: 0 },
          { id: 'B', shape: 'square', rotation: 0 },
          { id: 'C', shape: 'circle', rotation: 0 },
          { id: 'D', shape: 'rectangle', rotation: 0 },
          { id: 'E', shape: 'pentagon', rotation: 0 },
          { id: 'F', shape: 'hexagon', rotation: 0 }
        ],
        correctCombination: ['A', 'B', 'C'],
        gridSize: [3, 3]
      }
    },
    ...generateIRTParams(3)
  },
  {
    id: 'ds_001',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 2,
    question: 'Remember the sequence of digits in the exact order',
    options: ['3-7-2-9-1', '3-7-2-9-5', '3-7-2-9-8', '3-7-2-9-4'],
    correctAnswer: 0,
    timeLimit: 90,
    explanation: 'Focus on the order and replay the sequence mentally',
    taskType: TaskType.DIGIT_SPAN,
    taskData: {
      digitSequence: [3, 7, 2, 9, 1]
    },
    ...generateIRTParams(2)
  },
  {
    id: 'ds_002',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 4,
    question: 'Remember this longer sequence of digits',
    options: ['8-4-1-6-9-3-7-2', '8-4-1-6-9-3-7-5', '8-4-1-6-9-3-7-8', '8-4-1-6-9-3-7-1'],
    correctAnswer: 0,
    timeLimit: 120,
    explanation: 'Use chunking strategies to remember longer sequences',
    taskType: TaskType.DIGIT_SPAN,
    taskData: {
      digitSequence: [8, 4, 1, 6, 9, 3, 7, 2]
    },
    ...generateIRTParams(4)
  },
  {
    id: 'sc_001',
    category: QuestionCategory.CODING_TASK,
    difficulty: 2,
    question: 'Match each symbol with its corresponding number using the reference key',
    options: ['◆=1, ◇=2, ▲=3', '◆=2, ◇=1, ▲=3', '◆=1, ◇=3, ▲=2', '◆=3, ◇=1, ▲=2'],
    correctAnswer: 0,
    timeLimit: 90,
    explanation: 'Work quickly but accurately using the symbol-number key',
    taskType: TaskType.SYMBOL_CODING,
    taskData: {
      symbolPairs: [
        { symbol: '◆', code: '1' },
        { symbol: '◇', code: '2' },
        { symbol: '▲', code: '3' },
        { symbol: '▼', code: '4' },
        { symbol: '●', code: '5' },
        { symbol: '○', code: '6' },
        { symbol: '■', code: '7' },
        { symbol: '□', code: '8' }
      ]
    },
    ...generateIRTParams(2)
  },
  {
    id: 'nb_001',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 5,
    question: 'Identify when the current position matches the position from 2 trials ago',
    options: ['Match found', 'No match', 'Cannot determine', 'Multiple matches'],
    correctAnswer: 0,
    timeLimit: 180,
    explanation: 'Focus on spatial positions and compare with 2 trials back',
    taskType: TaskType.WORKING_MEMORY_NBACK,
    taskData: {
      nBackLevel: 2,
      memoryItems: [
        { id: '1', content: '🔵', position: [0, 0] },
        { id: '2', content: '🔴', position: [0, 1] },
        { id: '3', content: '🟢', position: [0, 0] }, // Match with item 1
        { id: '4', content: '🟡', position: [1, 1] },
        { id: '5', content: '🔵', position: [0, 1] }, // Match with item 2
        { id: '6', content: '🔴', position: [1, 0] }
      ]
    },
    ...generateIRTParams(5)
  },
  {
    id: 'ps_002',
    category: QuestionCategory.PROCESSING_SPEED,
    difficulty: 3,
    question: 'Find all target symbols as quickly as possible',
    options: ['3 targets found', '4 targets found', '5 targets found', '6 targets found'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Scan systematically and click on target symbols only',
    taskType: TaskType.PROCESSING_SPEED_SCAN,
    taskData: {
      targetSymbols: ['★', '♦'],
      searchArray: [] // Will be generated in component
    },
    ...generateIRTParams(3)
  },
  {
    id: 'sr_001',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 4,
    question: 'Rotate the 3D object to match the target orientation',
    options: ['45° rotation', '90° rotation', '135° rotation', '180° rotation'],
    correctAnswer: 1,
    timeLimit: 180,
    explanation: 'Use the rotation controls to match the target 3D orientation',
    taskType: TaskType.SPATIAL_ROTATION,
    taskData: {
      spatialObjects: [
        {
          id: 'target',
          shape: '3d_cube',
          rotation: [45, 90, 0],
          color: '#8B5CF6'
        },
        {
          id: 'task',
          shape: '3d_cube',
          rotation: [0, 0, 0],
          color: '#8B5CF6'
        }
      ],
      rotationAngles: [45, 90, 135, 180]
    },
    ...generateIRTParams(4)
  },
  {
    id: 'fw_001',
    category: QuestionCategory.FIGURE_WEIGHTS,
    difficulty: 3,
    question: 'Balance the scale by selecting the correct weight',
    options: ['2 units', '4 units', '6 units', '8 units'],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Calculate the total weight needed to balance both sides',
    taskType: TaskType.FIGURE_BALANCE,
    taskData: {
      scaleData: {
        leftSide: [
          { id: '1', value: 3, shape: 'circle', color: '#EF4444' },
          { id: '2', value: 5, shape: 'square', color: '#3B82F6' }
        ],
        rightSide: [
          { id: '3', value: 4, shape: 'triangle', color: '#10B981' }
        ],
        missingWeight: 'right',
        availableWeights: [
          { id: 'opt1', value: 2, shape: 'circle', color: '#F59E0B' },
          { id: 'opt2', value: 4, shape: 'square', color: '#8B5CF6' },
          { id: 'opt3', value: 6, shape: 'triangle', color: '#EC4899' }
        ],
        correctWeight: '4'
      }
    },
    ...generateIRTParams(3)
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