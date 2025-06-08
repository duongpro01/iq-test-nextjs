# Adaptive IQ Test System

A comprehensive, web-based IQ testing platform built with Next.js, TypeScript, and modern web technologies. This system delivers an advanced intelligence assessment with adaptive difficulty, real-time scoring, and detailed analytics.

## 🧠 Features

### Core Functionality
- **Adaptive Difficulty Engine**: Questions adjust in real-time based on user performance using computerized adaptive testing (CAT) algorithms
- **Multiple Question Categories**: 
  - Pattern Recognition
  - Spatial Reasoning
  - Logic & Critical Thinking
  - Short-Term Memory
  - Mathematical Puzzles
- **Real-Time Timer System**: Global test timer (30 minutes) with per-question time limits
- **Advanced Scoring**: Item Response Theory (IRT) based scoring with percentile rankings
- **Comprehensive Analytics**: Detailed performance breakdown with interactive charts

### User Experience
- **Modern UI**: Built with shadcn/ui components for consistent, accessible design
- **Dark/Light Mode**: Automatic theme switching with manual toggle
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Test Security**: Disabled right-click, keyboard shortcuts, and navigation during test

### Technical Features
- **State Management**: Zustand for efficient state handling with persistence
- **Data Visualization**: Recharts for interactive performance charts
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with Next.js 15 and Turbopack
- **Accessibility**: WCAG compliant components and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iq-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📊 How It Works

### Adaptive Testing Algorithm

The system uses a binary-search-like approach to adjust question difficulty:

1. **Starting Point**: Begin at medium difficulty (level 5 on 1-10 scale)
2. **Correct Answer**: Increase difficulty by 1 level
3. **Incorrect Answer**: Decrease difficulty by 1 level
4. **Bounds**: Difficulty clamped between levels 1-10
5. **Question Pool**: Each difficulty level has multiple questions to prevent repetition

### Scoring System

The IQ estimation uses a simplified Item Response Theory (IRT) model:

```typescript
// Simplified scoring formula
const averageDifficulty = totalDifficulty / totalQuestions;
const difficultyWeight = (averageDifficulty - 5.5) * 2;
const accuracyWeight = (accuracy - 50) * 0.3;
const timeBonus = averageResponseTime < 30000 ? 5 : 0;
const estimatedIQ = clamp(100 + difficultyWeight + accuracyWeight + timeBonus, 70, 160);
```

### Question Categories

1. **Pattern Recognition**: Sequences, progressions, and logical patterns
2. **Spatial Reasoning**: 3D visualization, rotation, and geometric relationships
3. **Logic**: Syllogisms, conditional reasoning, and deductive thinking
4. **Short-Term Memory**: Sequence recall and working memory tasks
5. **Math Puzzles**: Algebraic thinking and numerical reasoning

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### State & Data
- **Zustand**: Lightweight state management
- **Recharts**: Data visualization
- **LocalStorage**: Client-side persistence

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Turbopack**: Fast bundling

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and theme variables
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── welcome-screen.tsx # Test introduction and setup
│   ├── question-card.tsx  # Individual question display
│   ├── results-dashboard.tsx # Results and analytics
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Dark/light mode toggle
├── store/                # State management
│   └── test-store.ts     # Zustand store for test state
├── data/                 # Static data
│   └── questions.ts      # Question database
├── types/                # TypeScript definitions
│   └── index.ts          # Type definitions
└── lib/                  # Utilities
    └── utils.ts          # Helper functions
```

## 🎯 Usage Guide

### Taking the Test

1. **Welcome Screen**: Review instructions and test information
2. **Question Phase**: 
   - Answer questions to the best of your ability
   - Questions adapt to your performance level
   - Monitor global and per-question timers
   - Cannot navigate back to previous questions
3. **Results Phase**: 
   - View comprehensive performance analysis
   - Explore category-specific breakdowns
   - Compare with population distribution
   - Download or share results

### Test Security Features

- Right-click disabled during test
- Keyboard shortcuts blocked (F12, Ctrl+Shift+I, etc.)
- Page refresh warning when test is active
- Text selection disabled in test area
- No back navigation allowed

## 📈 Analytics & Results

### Provided Metrics
- **IQ Score**: Estimated intelligence quotient (70-160 range)
- **Percentile Rank**: Population comparison
- **Accuracy**: Overall percentage correct
- **Response Time**: Average time per question
- **Category Performance**: Breakdown by cognitive domain
- **Difficulty Progression**: Adaptive difficulty path visualization

### Classifications
- Very Superior (130+)
- Superior (120-129)
- High Average (110-119)
- Average (90-109)
- Low Average (80-89)
- Borderline (70-79)
- Extremely Low (<70)

## ⚙️ Configuration

### Test Settings
Modify `src/store/test-store.ts` to adjust:

```typescript
const defaultConfig: AdaptiveTestConfig = {
  totalQuestions: 30,        // Number of questions
  globalTimeLimit: 1800,     // Total time (seconds)
  questionTimeLimit: 60,     // Per-question time (seconds)
  startingDifficulty: 5,     // Initial difficulty level
  minDifficulty: 1,          // Minimum difficulty
  maxDifficulty: 10,         // Maximum difficulty
  penalizeSlowAnswers: true, // Time penalties
  penalizeFastAnswers: false // Speed penalties
};
```

### Adding Questions
Add new questions to `src/data/questions.ts`:

```typescript
{
  id: 'unique_id',
  category: QuestionCategory.PATTERN_RECOGNITION,
  difficulty: 5,
  question: 'Your question text',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 0, // Index of correct option
  timeLimit: 60,
  explanation: 'Explanation of the correct answer'
}
```

## 🔒 Privacy & Ethics

- **No Data Collection**: All data stored locally in browser
- **Educational Purpose**: Results for educational/entertainment use only
- **Not Clinical**: Should not replace professional psychological assessment
- **Transparent**: Open-source algorithm and scoring methodology

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Psychometric Theory**: Based on established IQ testing principles
- **shadcn/ui**: For the excellent component library
- **Recharts**: For data visualization capabilities
- **Next.js Team**: For the amazing framework
- **Open Source Community**: For the tools and libraries that made this possible

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the documentation
- Review existing discussions

---

**Disclaimer**: This IQ test is designed for educational and entertainment purposes. Results should not be used for clinical diagnosis, employment decisions, or academic placement. For professional psychological assessment, consult a qualified psychologist.
