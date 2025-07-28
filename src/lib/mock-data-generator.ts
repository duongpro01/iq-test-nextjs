import { TestResult } from '@/types';

export function generateMockProgressionData(totalQuestions: number = 30): {
  difficultyProgression: number[];
  abilityProgression: number[];
  informationCurve: number[];
} {
  const difficultyProgression: number[] = [];
  const abilityProgression: number[] = [];
  const informationCurve: number[] = [];

  // Start with initial values
  let currentAbility = 50; // Start high
  let currentDifficulty = 5; // Start low

  for (let i = 0; i < totalQuestions; i++) {
    // Generate realistic difficulty progression
    // Difficulty should generally follow ability but with some variation
    const difficultyVariation = (Math.random() - 0.5) * 10;
    const targetDifficulty = Math.max(1, Math.min(20, currentAbility / 3 + difficultyVariation));
    currentDifficulty = currentDifficulty * 0.8 + targetDifficulty * 0.2; // Smooth transition
    difficultyProgression.push(Math.max(1, Math.min(20, currentDifficulty)));

    // Generate realistic ability progression
    // Ability should generally decrease as test progresses (fatigue effect)
    const fatigueEffect = -0.5 * (i / totalQuestions); // Gradual decline
    const randomVariation = (Math.random() - 0.5) * 8;
    const performanceEffect = Math.random() > 0.6 ? 2 : -1; // Occasional good/bad performance
    
    currentAbility = Math.max(5, Math.min(60, currentAbility + fatigueEffect + randomVariation + performanceEffect));
    abilityProgression.push(currentAbility);

    // Generate information gained (should be higher for questions near ability level)
    const difficultyMatch = 1 - Math.abs(currentAbility - currentDifficulty) / 20;
    const baseInformation = 0.1 + difficultyMatch * 0.3;
    const randomInfo = Math.random() * 0.2;
    informationCurve.push(Math.max(0.05, Math.min(0.8, baseInformation + randomInfo)));
  }

  return {
    difficultyProgression,
    abilityProgression,
    informationCurve
  };
}

export function enhanceTestResultWithMockProgression(result: TestResult): TestResult {
  const mockData = generateMockProgressionData(result.totalQuestions);
  
  return {
    ...result,
    difficultyProgression: mockData.difficultyProgression,
    abilityProgression: mockData.abilityProgression,
    informationCurve: mockData.informationCurve
  };
} 