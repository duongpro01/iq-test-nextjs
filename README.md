# 🧠 Adaptive IQ Testing System

A production-grade, scientifically rigorous IQ testing web application that matches the psychometric standards of professional assessments like WAIS, Raven's Progressive Matrices, and Mensa tests.

## 🌟 Key Features

### 🎯 Scientific Rigor
- **Item Response Theory (IRT)**: Full 3-Parameter Logistic Model implementation
- **Bayesian Estimation**: Real-time ability estimation with confidence intervals
- **Computerized Adaptive Testing (CAT)**: Dynamic difficulty adjustment
- **Psychometric Validation**: Cronbach's Alpha, measurement precision, and reliability metrics

### 🧪 Advanced Analytics
- **Domain Mastery Analysis**: Detailed cognitive domain breakdown
- **Confidence Intervals**: 95% CI for IQ scores with measurement precision
- **Population Comparisons**: Percentile rankings and distribution analysis
- **Response Pattern Analysis**: Time-accuracy relationships and efficiency metrics

### 🔒 Test Security
- **Anti-Cheating Measures**: Disabled right-click, keyboard shortcuts, and navigation
- **Pattern Detection**: Suspicious response time and accuracy anomaly detection
- **Session Integrity**: Prevents page refresh and back navigation during tests

### 📊 Comprehensive Reporting
- **Interactive Visualizations**: Radar charts, progression curves, and scatter plots
- **Domain-Specific Insights**: Strengths and improvement areas per cognitive domain
- **Reliability Indicators**: Internal consistency and measurement quality metrics

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 15** with App Router
- **TypeScript** with strict typing
- **TailwindCSS** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Zustand** for state management

### Psychometric Engine
- **IRT 3-Parameter Logistic Model**: P(θ) = c + (1-c) / (1 + exp(-a(θ-b)))
- **Maximum Likelihood Estimation (MLE)** with Newton-Raphson optimization
- **Expected A Posteriori (EAP)** Bayesian estimation
- **Fisher Information** calculation for optimal question selection
- **Adaptive Algorithm** with content balancing and exposure control

### Question Database
- **100+ Calibrated Questions** across 5 cognitive domains
- **IRT Parameters**: Discrimination (a), Difficulty (b), and Guessing (c) values
- **Metadata Tracking**: Response times, accuracy rates, and calibration history
- **Dynamic Difficulty**: 10-level scale with scientific mapping to IRT logits

## 🧠 Cognitive Domains

### 1. Pattern Recognition
- Sequence completion
- Fibonacci and mathematical series
- Prime number identification
- Geometric progressions

### 2. Spatial Reasoning
- 3D visualization
- Mental rotation
- Geometric relationships
- Spatial transformations

### 3. Logical Deduction
- Syllogistic reasoning
- Conditional logic
- Set theory applications
- Logical fallacy identification

### 4. Numerical Reasoning
- Algebraic problem solving
- Percentage calculations
- Rate and proportion problems
- Mathematical word problems

### 5. Short-Term Memory
- Sequence recall
- Pattern memorization
- Information retention
- Working memory tasks

## 📈 Scoring System

### IQ Calculation
- **Ability Estimate (θ)**: Continuous scale from -3 to +3 logits
- **IQ Conversion**: IQ = 100 + 15 × θ
- **Classification Ranges**:
  - Extremely Gifted: 160+
  - Highly Gifted: 145-159
  - Moderately Gifted: 130-144
  - Superior: 120-129
  - High Average: 110-119
  - Average: 90-109
  - Low Average: 80-89
  - Borderline: 70-79

### Reliability Metrics
- **Cronbach's Alpha**: Internal consistency (target >0.70)
- **Standard Error**: Measurement precision (lower is better)
- **Test Reliability**: Overall measurement quality
- **Information Curve**: Question-by-question information gain

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/iq-test-system.git
   cd iq-test-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🔧 Configuration

### Test Parameters
Edit `src/store/test-store.ts` to modify:

```typescript
const defaultConfig: AdaptiveTestConfig = {
  totalQuestions: 30,           // Number of questions
  globalTimeLimit: 1800,        // 30 minutes in seconds
  questionTimeLimit: 60,        // 60 seconds per question
  startingAbility: 0.0,         // Initial θ estimate
  targetStandardError: 0.3,     // Stop when SE < this
  selectionMethod: 'MaxInfo',   // Question selection strategy
  contentBalancing: true,       // Ensure domain coverage
  // ... more options
};
```

### Question Management
Add new questions in `src/data/questions.ts`:

```typescript
{
  id: 'unique_id',
  category: QuestionCategory.PATTERN_RECOGNITION,
  difficulty: 5,                // 1-10 scale
  question: 'Your question text',
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 1,             // Index of correct option
  timeLimit: 60,
  explanation: 'Explanation text',
  // IRT parameters (auto-generated or manually calibrated)
  a: 1.2,                       // Discrimination
  b: 0.0,                       // Difficulty in logits
  c: 0.25,                      // Guessing parameter
  // Calibration metadata
  timesAnswered: 500,
  timesCorrect: 350,
  averageResponseTime: 35000,
  lastCalibrated: new Date()
}
```

## 📊 Analytics Dashboard

### Performance Metrics
- **Accuracy**: Overall and domain-specific percentages
- **Response Times**: Average and distribution analysis
- **Difficulty Progression**: Adaptive algorithm visualization
- **Ability Estimation**: Real-time θ progression

### Visualizations
- **Radar Chart**: Multi-domain performance overview
- **Line Charts**: Difficulty and ability progression
- **Scatter Plots**: Time-accuracy relationships
- **Area Charts**: Population distribution comparisons

### Domain Analysis
- **Mastery Levels**: Novice → Developing → Proficient → Advanced → Expert
- **Strength Areas**: Identified high-performance domains
- **Improvement Areas**: Targeted development recommendations
- **Ability Estimates**: Domain-specific θ values with standard errors

## 🔬 Psychometric Validation

### IRT Model Implementation
The system implements the full 3-Parameter Logistic Model:

```
P(θ) = c + (1 - c) / (1 + exp(-a(θ - b)))
```

Where:
- **θ (theta)**: Person ability parameter
- **a**: Item discrimination parameter (0.5-3.0)
- **b**: Item difficulty parameter (-3 to +3 logits)
- **c**: Pseudo-guessing parameter (0.0-0.5)

### Bayesian Estimation
Uses Expected A Posteriori (EAP) method with:
- **Prior Distribution**: Normal(0, 1)
- **Quadrature Points**: 41-point Gaussian quadrature
- **Convergence Criterion**: 0.001 change in θ
- **Maximum Iterations**: 50

### Question Selection
Maximum Information criterion:
```
I(θ) = a² × P'(θ)² / [P(θ) × (1 - P(θ))]
```

With constraints for:
- Content balancing across domains
- Exposure control to prevent overuse
- Difficulty range limitations

## 🛡️ Security Features

### Anti-Cheating Measures
- Disabled right-click context menu
- Blocked keyboard shortcuts (F12, Ctrl+Shift+I, etc.)
- Text selection prevention during test
- Page navigation warnings
- Response pattern analysis

### Data Privacy
- Local storage only (no server transmission)
- No personal information collection
- Session-based data management
- Optional result persistence

## 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large tap targets and gestures
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark Mode**: Automatic theme switching
- **Print Support**: Formatted result printing

## 🧪 Testing & Quality

### Psychometric Validation
- **Content Validity**: Expert review of question content
- **Construct Validity**: Factor analysis of domain structure
- **Criterion Validity**: Correlation with established tests
- **Reliability**: Internal consistency and test-retest reliability

### Technical Testing
- **Unit Tests**: Core IRT calculations
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load and stress testing

## 📚 Scientific References

### Psychometric Theory
- Lord, F. M. (1980). *Applications of Item Response Theory to Practical Testing Problems*
- Hambleton, R. K., & Swaminathan, H. (1985). *Item Response Theory: Principles and Applications*
- van der Linden, W. J. (2016). *Handbook of Item Response Theory*

### Adaptive Testing
- Wainer, H. (2000). *Computerized Adaptive Testing: A Primer*
- Thompson, N. A. (2009). *Item Selection in Computerized Classification Testing*

### Cognitive Assessment
- Carroll, J. B. (1993). *Human Cognitive Abilities: A Survey of Factor-Analytic Studies*
- McGrew, K. S. (2009). CHC theory and the human cognitive abilities project

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Maintain test coverage >80%
3. Use semantic commit messages
4. Update documentation for new features
5. Validate psychometric accuracy

### Question Contribution
1. Provide content validity evidence
2. Include difficulty estimates
3. Test with diverse populations
4. Document source and rationale
5. Follow ethical guidelines

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This test is for educational and research purposes only. While it uses scientifically-based psychometric methods, it should not be considered a substitute for professional psychological assessment. For official IQ testing or cognitive evaluation, please consult a qualified psychologist.

## 🔗 Links

- **Demo**: [Live Demo](https://your-demo-url.com)
- **Documentation**: [Full Docs](https://your-docs-url.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/iq-test-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/iq-test-system/discussions)

---

**Built with ❤️ for the advancement of cognitive assessment technology**
