import { Question, UserAnswer, QuestionCategory, SmartHint, CognitiveWeakness, TrainingRecommendation } from '@/types';

// Smart hint generation interfaces
export interface HintContext {
  question: Question;
  wrongAnswers: number[];
  timeSpent: number;
  previousHints: SmartHint[];
  userAbility: number;
  domainHistory: UserAnswer[];
}

export interface HintStrategy {
  type: 'socratic' | 'conceptual' | 'strategic' | 'elimination';
  priority: number;
  applicableCategories: QuestionCategory[];
  generateHint: (context: HintContext) => SmartHint | null;
}

export interface CognitivePattern {
  pattern: string;
  frequency: number;
  severity: 'mild' | 'moderate' | 'significant';
  category: QuestionCategory;
  description: string;
  interventions: string[];
}

class SmartHintsEngine {
  private hintStrategies: HintStrategy[] = [];
  private cognitivePatterns: Map<string, CognitivePattern> = new Map();
  private userPatterns: Map<string, CognitivePattern[]> = new Map();

  constructor() {
    this.initializeHintStrategies();
    this.initializeCognitivePatterns();
  }

  /**
   * Initialize hint generation strategies
   */
  private initializeHintStrategies(): void {
    this.hintStrategies = [
      // Socratic questioning strategy
      {
        type: 'socratic',
        priority: 1,
        applicableCategories: [
          QuestionCategory.LOGICAL_DEDUCTION,
          QuestionCategory.PATTERN_RECOGNITION
        ],
        generateHint: (context) => this.generateSocraticHint(context)
      },

      // Conceptual understanding strategy
      {
        type: 'conceptual',
        priority: 2,
        applicableCategories: [
          QuestionCategory.SPATIAL_REASONING,
          QuestionCategory.NUMERICAL_REASONING
        ],
        generateHint: (context) => this.generateConceptualHint(context)
      },

      // Strategic approach strategy
      {
        type: 'strategic',
        priority: 3,
        applicableCategories: Object.values(QuestionCategory),
        generateHint: (context) => this.generateStrategicHint(context)
      },

      // Process of elimination strategy
      {
        type: 'elimination',
        priority: 4,
        applicableCategories: Object.values(QuestionCategory),
        generateHint: (context) => this.generateEliminationHint(context)
      }
    ];
  }

  /**
   * Initialize cognitive weakness patterns
   */
  private initializeCognitivePatterns(): void {
    const patterns: CognitivePattern[] = [
      {
        pattern: 'sequential_pattern_difficulty',
        frequency: 0,
        severity: 'mild',
        category: QuestionCategory.PATTERN_RECOGNITION,
        description: 'Difficulty recognizing sequential patterns',
        interventions: [
          'Practice number sequences',
          'Focus on step-by-step pattern analysis',
          'Use visual pattern exercises'
        ]
      },
      {
        pattern: 'spatial_rotation_weakness',
        frequency: 0,
        severity: 'moderate',
        category: QuestionCategory.SPATIAL_REASONING,
        description: 'Challenges with mental rotation tasks',
        interventions: [
          'Practice 3D visualization exercises',
          'Use physical manipulation tools',
          'Break down rotation into steps'
        ]
      },
      {
        pattern: 'logical_premise_confusion',
        frequency: 0,
        severity: 'significant',
        category: QuestionCategory.LOGICAL_DEDUCTION,
        description: 'Difficulty tracking logical premises',
        interventions: [
          'Practice syllogistic reasoning',
          'Use visual logic diagrams',
          'Break arguments into components'
        ]
      },
      {
        pattern: 'working_memory_overload',
        frequency: 0,
        severity: 'moderate',
        category: QuestionCategory.SHORT_TERM_MEMORY,
        description: 'Working memory capacity limitations',
        interventions: [
          'Use chunking strategies',
          'Practice memory palace techniques',
          'Reduce cognitive load with external aids'
        ]
      },
      {
        pattern: 'numerical_operation_errors',
        frequency: 0,
        severity: 'mild',
        category: QuestionCategory.NUMERICAL_REASONING,
        description: 'Errors in numerical calculations',
        interventions: [
          'Practice mental math',
          'Use estimation strategies',
          'Double-check calculations'
        ]
      }
    ];

    patterns.forEach(pattern => {
      this.cognitivePatterns.set(pattern.pattern, pattern);
    });
  }

  /**
   * Generate smart hint for a question
   */
  generateHint(context: HintContext): SmartHint | null {
    // Find applicable strategies for this question category
    const applicableStrategies = this.hintStrategies
      .filter(strategy => strategy.applicableCategories.includes(context.question.category))
      .sort((a, b) => a.priority - b.priority);

    // Try each strategy until one generates a hint
    for (const strategy of applicableStrategies) {
      const hint = strategy.generateHint(context);
      if (hint) {
        return hint;
      }
    }

    return null;
  }

  /**
   * Generate Socratic-style hint
   */
  private generateSocraticHint(context: HintContext): SmartHint | null {
    const { question, wrongAnswers } = context;

    let hintText = '';
    const hintId = `socratic_${question.id}_${Date.now()}`;

    switch (question.category) {
      case QuestionCategory.LOGICAL_DEDUCTION:
        if (wrongAnswers.length > 0) {
          hintText = "What assumptions are you making? Try to identify the key premises in the statement and see how they connect.";
        } else {
          hintText = "What logical relationship exists between the given statements? Consider what must be true if the premises are correct.";
        }
        break;

      case QuestionCategory.PATTERN_RECOGNITION:
        if (wrongAnswers.length > 0) {
          hintText = "What changes between each element? Look for mathematical relationships, not just visual similarities.";
        } else {
          hintText = "What rule governs the sequence? Consider both the direction and magnitude of changes.";
        }
        break;

      default:
        return null;
    }

    return {
      id: hintId,
      questionId: question.id,
      hintText,
      hintType: 'socratic',
      difficulty: Math.max(1, question.difficulty - 1),
      usageCount: 0,
      effectiveness: 0.8
    };
  }

  /**
   * Generate conceptual understanding hint
   */
  private generateConceptualHint(context: HintContext): SmartHint | null {
    const { question } = context;

    let hintText = '';
    const hintId = `conceptual_${question.id}_${Date.now()}`;

    switch (question.category) {
      case QuestionCategory.SPATIAL_REASONING:
        if (question.question.includes('rotate') || question.question.includes('turn')) {
          hintText = "Imagine physically rotating the object. Which direction and how many degrees? Visualize each step of the rotation.";
        } else if (question.question.includes('fold') || question.question.includes('unfold')) {
          hintText = "Think about how paper behaves when folded. What happens to holes or marks when you unfold?";
        } else {
          hintText = "Break down the spatial transformation into smaller steps. What changes and what stays the same?";
        }
        break;

      case QuestionCategory.NUMERICAL_REASONING:
        if (question.question.includes('%') || question.question.includes('percent')) {
          hintText = "Remember: percentage means 'per hundred'. Convert percentages to decimals or fractions to make calculations easier.";
        } else if (question.question.includes('ratio') || question.question.includes('proportion')) {
          hintText = "Set up the ratio as a fraction. Cross-multiply to solve for the unknown value.";
        } else {
          hintText = "Identify what mathematical operation is needed. Work through the problem step by step.";
        }
        break;

      default:
        return null;
    }

    return {
      id: hintId,
      questionId: question.id,
      hintText,
      hintType: 'conceptual',
      difficulty: question.difficulty,
      usageCount: 0,
      effectiveness: 0.75
    };
  }

  /**
   * Generate strategic approach hint
   */
  private generateStrategicHint(context: HintContext): SmartHint | null {
    const { question, timeSpent, wrongAnswers } = context;

    let hintText = '';
    const hintId = `strategic_${question.id}_${Date.now()}`;

    // Time-based strategies
    if (timeSpent > question.timeLimit * 0.7) {
      hintText = "You're spending a lot of time on this. Try to eliminate obviously wrong answers first, then make your best guess.";
    } else if (wrongAnswers.length >= 2) {
      hintText = "You've tried multiple answers. Step back and reconsider the question from a different angle.";
    } else {
      // Category-specific strategies
      switch (question.category) {
        case QuestionCategory.PATTERN_RECOGNITION:
          hintText = "Look for the simplest pattern first. Often the answer follows a basic mathematical progression.";
          break;
        case QuestionCategory.SPATIAL_REASONING:
          hintText = "Use your finger to trace the transformation. Sometimes physical movement helps visualize the answer.";
          break;
        case QuestionCategory.LOGICAL_DEDUCTION:
          hintText = "Draw a simple diagram or list the given facts. Visual organization can clarify logical relationships.";
          break;
        case QuestionCategory.SHORT_TERM_MEMORY:
          hintText = "Group items into meaningful chunks. Look for patterns or associations to aid recall.";
          break;
        case QuestionCategory.NUMERICAL_REASONING:
          hintText = "Estimate the answer first. This helps you check if your calculation is reasonable.";
          break;
      }
    }

    return {
      id: hintId,
      questionId: question.id,
      hintText,
      hintType: 'strategic',
      difficulty: Math.min(10, question.difficulty + 1),
      usageCount: 0,
      effectiveness: 0.65
    };
  }

  /**
   * Generate elimination hint
   */
  private generateEliminationHint(context: HintContext): SmartHint | null {
    const { question, wrongAnswers } = context;

    if (question.options.length < 3) return null;

    const hintId = `elimination_${question.id}_${Date.now()}`;
    let hintText = '';

    if (wrongAnswers.length === 0) {
      hintText = "Look for answers that are clearly different from the others. Often you can eliminate 1-2 options immediately.";
    } else {
      const remainingOptions = question.options.length - wrongAnswers.length;
      if (remainingOptions > 2) {
        hintText = `You've eliminated ${wrongAnswers.length} option(s). Can you rule out any others based on the pattern or logic?`;
      } else {
        hintText = "You're down to the final options. Compare them carefully and choose the one that best fits the pattern.";
      }
    }

    return {
      id: hintId,
      questionId: question.id,
      hintText,
      hintType: 'elimination',
      difficulty: Math.max(1, question.difficulty - 2),
      usageCount: 0,
      effectiveness: 0.6
    };
  }

  /**
   * Analyze user's cognitive patterns
   */
  analyzeCognitiveWeaknesses(userId: string, userAnswers: UserAnswer[]): CognitiveWeakness[] {
    const weaknesses: CognitiveWeakness[] = [];
    const patterns = this.detectPatterns(userAnswers);

    // Update user patterns
    this.userPatterns.set(userId, patterns);

    // Convert patterns to weaknesses
    patterns.forEach(pattern => {
      if (pattern.frequency >= 3) { // Threshold for significance
        const weakness: CognitiveWeakness = {
          domain: pattern.category,
          severity: pattern.severity,
          patterns: [pattern.description],
          recommendations: this.generateRecommendations(pattern)
        };
        weaknesses.push(weakness);
      }
    });

    return weaknesses;
  }

  /**
   * Detect cognitive patterns from user answers
   */
  private detectPatterns(userAnswers: UserAnswer[]): CognitivePattern[] {
    const detectedPatterns: CognitivePattern[] = [];
    const categoryGroups = this.groupAnswersByCategory(userAnswers);

    Object.entries(categoryGroups).forEach(([category, answers]) => {
      const categoryEnum = category as QuestionCategory;
      
      // Analyze incorrect answers for patterns
      const incorrectAnswers = answers.filter(a => !a.isCorrect);
      
      if (incorrectAnswers.length >= 2) {
        const pattern = this.analyzeIncorrectAnswers(categoryEnum, incorrectAnswers);
        if (pattern) {
          detectedPatterns.push(pattern);
        }
      }

      // Analyze response times
      const slowAnswers = answers.filter(a => a.responseTime > 60); // > 1 minute
      if (slowAnswers.length >= 2) {
        const timePattern = this.analyzeResponseTimes(categoryEnum, answers);
        if (timePattern) {
          detectedPatterns.push(timePattern);
        }
      }
    });

    return detectedPatterns;
  }

  private groupAnswersByCategory(userAnswers: UserAnswer[]): Record<string, UserAnswer[]> {
    const groups: Record<string, UserAnswer[]> = {};
    
    userAnswers.forEach(answer => {
      // This would need to be enhanced to get question category from question ID
      const category = this.getQuestionCategory(answer.questionId);
      if (!groups[category]) groups[category] = [];
      groups[category].push(answer);
    });

    return groups;
  }

  private getQuestionCategory(_questionId: string): QuestionCategory {
    // This would look up the actual question category
    // For now, return a default
    return QuestionCategory.PATTERN_RECOGNITION;
  }

  private analyzeIncorrectAnswers(category: QuestionCategory, incorrectAnswers: UserAnswer[]): CognitivePattern | null {
    const basePattern = this.cognitivePatterns.get(`${category.toLowerCase()}_difficulty`);
    
    if (basePattern) {
      return {
        ...basePattern,
        frequency: incorrectAnswers.length,
        severity: incorrectAnswers.length >= 5 ? 'significant' : 
                 incorrectAnswers.length >= 3 ? 'moderate' : 'mild'
      };
    }

    return null;
  }

  private analyzeResponseTimes(category: QuestionCategory, answers: UserAnswer[]): CognitivePattern | null {
    const avgTime = answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length;
    
    if (avgTime > 90) { // 1.5 minutes average
      return {
        pattern: `${category.toLowerCase()}_slow_processing`,
        frequency: answers.length,
        severity: avgTime > 120 ? 'significant' : 'moderate',
        category,
        description: `Slower than average processing in ${category}`,
        interventions: [
          'Practice timed exercises',
          'Focus on pattern recognition speed',
          'Use elimination strategies'
        ]
      };
    }

    return null;
  }

  /**
   * Generate training recommendations
   */
  private generateRecommendations(pattern: CognitivePattern): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = [];

    pattern.interventions.forEach((intervention, index) => {
      recommendations.push({
        type: index === 0 ? 'mini-game' : 'practice',
        title: intervention,
        description: `Targeted training for ${pattern.description.toLowerCase()}`,
        estimatedTime: 10 + (index * 5),
        difficulty: pattern.severity === 'significant' ? 3 : 
                   pattern.severity === 'moderate' ? 5 : 7,
        targetSkills: [pattern.pattern]
      });
    });

    return recommendations;
  }

  /**
   * Get personalized training recommendations
   */
  getPersonalizedRecommendations(userId: string): TrainingRecommendation[] {
    const userPatterns = this.userPatterns.get(userId) || [];
    const recommendations: TrainingRecommendation[] = [];

    userPatterns.forEach(pattern => {
      const patternRecommendations = this.generateRecommendations(pattern);
      recommendations.push(...patternRecommendations);
    });

    // Sort by severity and frequency
    return recommendations.sort((a, b) => {
      const aPattern = userPatterns.find(p => p.pattern === a.targetSkills[0]);
      const bPattern = userPatterns.find(p => p.pattern === b.targetSkills[0]);
      
      if (!aPattern || !bPattern) return 0;
      
      const severityWeight = { significant: 3, moderate: 2, mild: 1 };
      const aScore = severityWeight[aPattern.severity] * aPattern.frequency;
      const bScore = severityWeight[bPattern.severity] * bPattern.frequency;
      
      return bScore - aScore;
    });
  }

  /**
   * Track hint effectiveness
   */
  trackHintEffectiveness(_hintId: string, _wasHelpful: boolean): void {
    // This would update the hint's effectiveness rating
    // and improve future hint generation
  }

  /**
   * Get hint usage statistics
   */
  getHintStatistics(): {
    totalHints: number;
    effectivenessRate: number;
    mostEffectiveType: string;
    categoryBreakdown: Record<QuestionCategory, number>;
  } {
    // Return statistics about hint usage and effectiveness
    return {
      totalHints: 0,
      effectivenessRate: 0.75,
      mostEffectiveType: 'socratic',
      categoryBreakdown: {
        [QuestionCategory.PATTERN_RECOGNITION]: 0,
        [QuestionCategory.SPATIAL_REASONING]: 0,
        [QuestionCategory.LOGICAL_DEDUCTION]: 0,
        [QuestionCategory.SHORT_TERM_MEMORY]: 0,
        [QuestionCategory.NUMERICAL_REASONING]: 0
      }
    };
  }
}

export const smartHintsEngine = new SmartHintsEngine(); 