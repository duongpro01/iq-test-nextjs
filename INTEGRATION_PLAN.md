# Kế Hoạch Tích Hợp IQ Test vào Trang Next.js Khác

## 🎯 Tổng Quan

Chuyển đổi hệ thống IQ test hiện tại thành một module có thể tích hợp vào bất kỳ trang Next.js nào khác.

## 📋 Phase 1: Chuẩn Bị & Tách Module

### 1.1 Tạo Package Structure
```
iq-test-module/
├── package.json
├── README.md
├── src/
│   ├── components/
│   │   ├── iq-test/
│   │   │   ├── TestInterface.tsx
│   │   │   ├── TestSettings.tsx
│   │   │   ├── TestResults.tsx
│   │   │   └── index.ts
│   │   └── ui/ (shadcn/ui components)
│   ├── lib/
│   │   ├── irt-engine.ts
│   │   ├── test-store.ts
│   │   └── utils.ts
│   ├── data/
│   │   └── questions.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       └── use-iq-test.ts
├── public/
│   └── locales/
└── dist/
```

### 1.2 Tách Components Chính
```typescript
// src/components/iq-test/index.ts
export { default as IQTestInterface } from './TestInterface';
export { default as IQTestSettings } from './TestSettings';
export { default as IQTestResults } from './TestResults';
export { default as IQTestProvider } from './TestProvider';
```

### 1.3 Tạo Provider Pattern
```typescript
// src/components/iq-test/TestProvider.tsx
interface IQTestProviderProps {
  children: React.ReactNode;
  config?: Partial<IQTestConfig>;
  onTestComplete?: (results: IQTestResults) => void;
  onTestStart?: () => void;
}

export const IQTestProvider: React.FC<IQTestProviderProps> = ({
  children,
  config,
  onTestComplete,
  onTestStart
}) => {
  // Provider logic
};
```

## 🔧 Phase 2: Modularization

### 2.1 Tạo Custom Hook
```typescript
// src/hooks/use-iq-test.ts
export const useIQTest = () => {
  const [testState, setTestState] = useState<'idle' | 'settings' | 'testing' | 'results'>('idle');
  const [testResults, setTestResults] = useState<IQTestResults | null>(null);
  
  const startTest = useCallback((config: IQTestConfig) => {
    // Start test logic
  }, []);
  
  const submitAnswer = useCallback((answer: number) => {
    // Submit answer logic
  }, []);
  
  const endTest = useCallback(() => {
    // End test logic
  }, []);
  
  return {
    testState,
    testResults,
    startTest,
    submitAnswer,
    endTest,
    resetTest: () => setTestState('idle')
  };
};
```

### 2.2 Tạo Configuration Interface
```typescript
// src/types/index.ts
export interface IQTestConfig {
  // Basic settings
  totalQuestions?: number;
  timeLimit?: number;
  questionTimeLimit?: number;
  
  // Advanced settings
  adaptiveTesting?: boolean;
  contentBalancing?: boolean;
  securityFeatures?: boolean;
  
  // UI customization
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'vi';
  showProgress?: boolean;
  showTimer?: boolean;
  
  // Callbacks
  onQuestionChange?: (questionIndex: number, totalQuestions: number) => void;
  onTimeUpdate?: (remainingTime: number) => void;
  onAnswerSubmit?: (answer: number, isCorrect: boolean) => void;
  onTestComplete?: (results: IQTestResults) => void;
}

export interface IQTestResults {
  iqScore: number;
  classification: string;
  accuracy: number;
  timeSpent: number;
  domainScores: Record<string, number>;
  detailedAnalysis: any;
}
```

## 🎨 Phase 3: UI Integration

### 3.1 Tạo Main Interface Component
```typescript
// src/components/iq-test/TestInterface.tsx
interface IQTestInterfaceProps {
  config?: IQTestConfig;
  className?: string;
  style?: React.CSSProperties;
}

export const IQTestInterface: React.FC<IQTestInterfaceProps> = ({
  config = defaultConfig,
  className,
  style
}) => {
  const { testState, startTest, submitAnswer, endTest } = useIQTest();
  
  return (
    <div className={`iq-test-container ${className}`} style={style}>
      {testState === 'idle' && (
        <IQTestWelcome onStart={() => setTestState('settings')} />
      )}
      
      {testState === 'settings' && (
        <IQTestSettings 
          config={config}
          onStart={startTest}
          onBack={() => setTestState('idle')}
        />
      )}
      
      {testState === 'testing' && (
        <IQTestSession 
          onSubmitAnswer={submitAnswer}
          onEnd={endTest}
        />
      )}
      
      {testState === 'results' && (
        <IQTestResults 
          results={testResults}
          onRetake={() => setTestState('settings')}
          onClose={() => setTestState('idle')}
        />
      )}
    </div>
  );
};
```

### 3.2 Tạo Styling System
```scss
// src/styles/iq-test.scss
.iq-test-container {
  --iq-primary-color: #3b82f6;
  --iq-secondary-color: #8b5cf6;
  --iq-success-color: #10b981;
  --iq-warning-color: #f59e0b;
  --iq-error-color: #ef4444;
  
  // Responsive design
  @media (max-width: 768px) {
    // Mobile styles
  }
  
  @media (min-width: 1024px) {
    // Desktop styles
  }
}
```

## 🔌 Phase 4: Integration Methods

### 4.1 Method 1: Component Integration
```typescript
// Trong trang Next.js chính
import { IQTestInterface } from '@your-org/iq-test-module';

export default function MainPage() {
  return (
    <div>
      <h1>Welcome to Our Platform</h1>
      
      {/* Other content */}
      
      <section className="iq-test-section">
        <h2>Take an IQ Test</h2>
        <IQTestInterface 
          config={{
            totalQuestions: 30,
            timeLimit: 1800,
            onTestComplete: (results) => {
              console.log('Test completed:', results);
              // Handle results
            }
          }}
        />
      </section>
    </div>
  );
}
```

### 4.2 Method 2: Modal Integration
```typescript
// src/components/iq-test/TestModal.tsx
export const IQTestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  config?: IQTestConfig;
}> = ({ isOpen, onClose, config }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <IQTestInterface config={config} />
    </Modal>
  );
};
```

### 4.3 Method 3: Route Integration
```typescript
// pages/iq-test.tsx hoặc app/iq-test/page.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

export default function IQTestPage() {
  return (
    <div className="iq-test-page">
      <header>
        <h1>IQ Test</h1>
        <p>Assess your cognitive abilities</p>
      </header>
      
      <main>
        <IQTestInterface />
      </main>
    </div>
  );
}
```

## 📦 Phase 5: Package Creation

### 5.1 Package.json Configuration
```json
{
  "name": "@your-org/iq-test-module",
  "version": "1.0.0",
  "description": "Modular IQ Test component for Next.js",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next": "^13.0.0"
  },
  "dependencies": {
    "zustand": "^5.0.0",
    "framer-motion": "^12.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "rollup": "^4.0.0",
    "@rollup/plugin-typescript": "^11.0.0"
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "type-check": "tsc --noEmit"
  }
}
```

### 5.2 Rollup Configuration
```javascript
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['react', 'react-dom', 'next'],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};
```

## 🚀 Phase 6: Usage Examples

### 6.1 Basic Integration
```typescript
// pages/features/iq-test.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

export default function FeaturesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Our Features</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="feature-card">
          <h2 className="text-xl font-semibold mb-4">IQ Assessment</h2>
          <p className="text-gray-600 mb-4">
            Take our scientifically validated IQ test to assess your cognitive abilities.
          </p>
          <IQTestInterface 
            config={{
              totalQuestions: 25,
              timeLimit: 1500,
              onTestComplete: (results) => {
                // Save results to user profile
                saveUserResults(results);
              }
            }}
          />
        </div>
        
        <div className="feature-card">
          <h2 className="text-xl font-semibold mb-4">Other Features</h2>
          {/* Other features */}
        </div>
      </div>
    </div>
  );
}
```

### 6.2 Advanced Integration with State Management
```typescript
// hooks/use-user-results.ts
export const useUserResults = () => {
  const [userResults, setUserResults] = useState<IQTestResults[]>([]);
  
  const addResult = useCallback((result: IQTestResults) => {
    setUserResults(prev => [...prev, result]);
    // Save to database
  }, []);
  
  const getAverageIQ = useCallback(() => {
    if (userResults.length === 0) return 0;
    return userResults.reduce((sum, result) => sum + result.iqScore, 0) / userResults.length;
  }, [userResults]);
  
  return { userResults, addResult, getAverageIQ };
};

// components/UserDashboard.tsx
export const UserDashboard = () => {
  const { userResults, addResult, getAverageIQ } = useUserResults();
  
  return (
    <div>
      <div className="stats-card">
        <h3>Your IQ Statistics</h3>
        <p>Average IQ: {getAverageIQ()}</p>
        <p>Tests Taken: {userResults.length}</p>
      </div>
      
      <IQTestInterface 
        config={{
          onTestComplete: addResult
        }}
      />
    </div>
  );
};
```

### 6.3 Modal Integration
```typescript
// components/IQTestButton.tsx
export const IQTestButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary"
      >
        Take IQ Test
      </button>
      
      <IQTestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={{
          totalQuestions: 20,
          timeLimit: 1200
        }}
      />
    </>
  );
};
```

## 🔧 Phase 7: Configuration Options

### 7.1 Theme Customization
```typescript
// src/components/iq-test/TestProvider.tsx
interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}

export const IQTestProvider: React.FC<{
  theme?: ThemeConfig;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const themeContext = {
    ...defaultTheme,
    ...theme
  };
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 7.2 Localization Support
```typescript
// src/hooks/use-localization.ts
export const useLocalization = (locale: string) => {
  const [translations, setTranslations] = useState({});
  
  useEffect(() => {
    import(`../locales/${locale}.json`)
      .then(module => setTranslations(module.default));
  }, [locale]);
  
  return translations;
};
```

## 📊 Phase 8: Analytics Integration

### 8.1 Event Tracking
```typescript
// src/utils/analytics.ts
export const trackIQTestEvent = (event: string, data?: any) => {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', event, data);
  }
  
  // Custom analytics
  fetch('/api/analytics/iq-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, timestamp: Date.now() })
  });
};
```

### 8.2 Performance Monitoring
```typescript
// src/hooks/use-performance.ts
export const usePerformanceMonitoring = () => {
  const trackTestPerformance = useCallback((metrics: TestMetrics) => {
    // Track performance metrics
    trackIQTestEvent('test_performance', metrics);
  }, []);
  
  return { trackTestPerformance };
};
```

## 🚀 Phase 9: Deployment Strategy

### 9.1 NPM Package
```bash
# Publish to npm
npm publish --access public

# Install in target project
npm install @your-org/iq-test-module
```

### 9.2 Git Submodule
```bash
# Add as submodule
git submodule add https://github.com/your-org/iq-test-module.git

# Update submodule
git submodule update --remote
```

### 9.3 Local Development
```bash
# Link package locally
npm link
cd ../target-project
npm link @your-org/iq-test-module
```

## 📋 Implementation Checklist

### ✅ Phase 1: Preparation
- [ ] Create modular structure
- [ ] Extract core components
- [ ] Create provider pattern
- [ ] Set up TypeScript configuration

### ✅ Phase 2: Modularization
- [ ] Create custom hooks
- [ ] Define configuration interfaces
- [ ] Implement state management
- [ ] Add error handling

### ✅ Phase 3: UI Integration
- [ ] Create main interface component
- [ ] Implement responsive design
- [ ] Add theme customization
- [ ] Create modal component

### ✅ Phase 4: Integration Methods
- [ ] Component integration
- [ ] Modal integration
- [ ] Route integration
- [ ] State management integration

### ✅ Phase 5: Package Creation
- [ ] Configure package.json
- [ ] Set up build process
- [ ] Create documentation
- [ ] Add examples

### ✅ Phase 6: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

### ✅ Phase 7: Documentation
- [ ] API documentation
- [ ] Usage examples
- [ ] Configuration guide
- [ ] Troubleshooting guide

## 🎯 Benefits of This Approach

### ✅ **Modularity**
- Independent component that can be used anywhere
- No dependencies on specific routing or state management
- Easy to maintain and update

### ✅ **Customization**
- Flexible configuration options
- Theme customization
- Localization support

### ✅ **Performance**
- Lazy loading support
- Optimized bundle size
- Efficient state management

### ✅ **Developer Experience**
- TypeScript support
- Comprehensive documentation
- Easy integration examples

### ✅ **Scalability**
- Can be used in multiple projects
- Easy to extend with new features
- Version control and updates

---

*This plan provides a comprehensive approach to integrating the IQ test as a modular component in any Next.js application.* 