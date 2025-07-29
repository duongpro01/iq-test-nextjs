# Ví Dụ Tích Hợp IQ Test vào Trang Next.js Khác

## 🎯 Scenario: E-Learning Platform

Giả sử bạn có một nền tảng e-learning và muốn thêm tính năng IQ test vào đó.

## 📁 Cấu Trúc Dự Án Mục Tiêu

```
my-elearning-platform/
├── package.json
├── next.config.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── courses/
│   │   │   └── page.tsx
│   │   ├── assessments/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CourseCard.tsx
│   │   └── AssessmentCard.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── database.ts
│   └── types/
│       └── index.ts
└── public/
    └── images/
```

## 🔧 Bước 1: Cài Đặt Module

### 1.1 Cài đặt từ NPM
```bash
npm install @your-org/iq-test-module
```

### 1.2 Hoặc sử dụng Git Submodule
```bash
git submodule add https://github.com/your-org/iq-test-module.git src/modules/iq-test
```

## 🎨 Bước 2: Tích Hợp Cơ Bản

### 2.1 Thêm vào trang chính
```typescript
// src/app/page.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to LearnSmart
          </h1>
          <p className="text-xl text-gray-600">
            Your comprehensive learning platform
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium">JavaScript Fundamentals</h3>
                <p className="text-gray-600">Learn the basics of JavaScript</p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-medium">React Development</h3>
                <p className="text-gray-600">Master React framework</p>
              </div>
            </div>
          </div>

          {/* IQ Test Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Cognitive Assessment</h2>
            <p className="text-gray-600 mb-6">
              Take our scientifically validated IQ test to understand your cognitive strengths.
            </p>
            
            <IQTestInterface 
              config={{
                totalQuestions: 25,
                timeLimit: 1500,
                theme: 'light',
                showProgress: true,
                showTimer: true,
                onTestComplete: (results) => {
                  console.log('IQ Test completed:', results);
                  // Save results to user profile
                  saveUserResults(results);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2.2 Tạo trang riêng cho IQ Test
```typescript
// src/app/iq-test/page.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

export default function IQTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            IQ Assessment
          </h1>
          <p className="text-gray-600">
            Evaluate your cognitive abilities with our comprehensive IQ test
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <IQTestInterface 
            config={{
              totalQuestions: 35,
              timeLimit: 2400,
              adaptiveTesting: true,
              contentBalancing: true,
              securityFeatures: true,
              onTestComplete: (results) => {
                // Handle test completion
                handleTestCompletion(results);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## 🔌 Bước 3: Tích Hợp Nâng Cao

### 3.1 Tích hợp với User Dashboard
```typescript
// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { IQTestInterface } from '@your-org/iq-test-module';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  iqResults: IQTestResults[];
  averageIQ: number;
  testsTaken: number;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showIQTest, setShowIQTest] = useState(false);

  useEffect(() => {
    // Load user profile
    loadUserProfile();
  }, []);

  const handleTestComplete = async (results: IQTestResults) => {
    // Save results to database
    await saveIQResults(results);
    
    // Update user profile
    setUserProfile(prev => prev ? {
      ...prev,
      iqResults: [...prev.iqResults, results],
      averageIQ: calculateAverageIQ([...prev.iqResults, results]),
      testsTaken: prev.testsTaken + 1
    } : null);
    
    setShowIQTest(false);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile.name}!
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Average IQ:</span>
                <span className="font-semibold">{userProfile.averageIQ}</span>
              </div>
              <div className="flex justify-between">
                <span>Tests Taken:</span>
                <span className="font-semibold">{userProfile.testsTaken}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Test:</span>
                <span className="font-semibold">
                  {userProfile.iqResults.length > 0 
                    ? new Date(userProfile.iqResults[userProfile.iqResults.length - 1].timestamp).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowIQTest(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Take IQ Test
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                View Course Progress
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                View Certificates
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {userProfile.iqResults.slice(-3).reverse().map((result, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium">IQ Test #{userProfile.iqResults.length - index}</div>
                  <div className="text-sm text-gray-600">
                    Score: {result.iqScore} • {new Date(result.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IQ Test Modal */}
        {showIQTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">IQ Assessment</h2>
                <button 
                  onClick={() => setShowIQTest(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <IQTestInterface 
                config={{
                  totalQuestions: 30,
                  timeLimit: 1800,
                  onTestComplete: handleTestComplete
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3.2 Tích hợp với Course System
```typescript
// src/app/courses/[courseId]/assessment/page.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

interface CourseAssessmentProps {
  params: {
    courseId: string;
  };
}

export default function CourseAssessmentPage({ params }: CourseAssessmentProps) {
  const courseId = params.courseId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Assessment
          </h1>
          <p className="text-gray-600">
            Complete this cognitive assessment to unlock advanced course content
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Complete 25 questions in 20 minutes</li>
              <li>Minimum score of 100 to unlock advanced modules</li>
              <li>You can retake the assessment once per week</li>
            </ul>
          </div>

          <IQTestInterface 
            config={{
              totalQuestions: 25,
              timeLimit: 1200,
              adaptiveTesting: true,
              onTestComplete: (results) => {
                // Check if user qualifies for advanced content
                if (results.iqScore >= 100) {
                  unlockAdvancedContent(courseId);
                }
                
                // Save assessment results
                saveAssessmentResults(courseId, results);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Bước 4: Tích Hợp với State Management

### 4.1 Sử dụng với Zustand
```typescript
// src/store/user-store.ts
import { create } from 'zustand';
import { IQTestResults } from '@your-org/iq-test-module';

interface UserStore {
  user: UserProfile | null;
  iqResults: IQTestResults[];
  addIQResult: (result: IQTestResults) => void;
  getAverageIQ: () => number;
  loadUserProfile: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  iqResults: [],
  
  addIQResult: (result) => {
    set(state => ({
      iqResults: [...state.iqResults, result],
      user: state.user ? {
        ...state.user,
        iqResults: [...state.user.iqResults, result],
        averageIQ: calculateAverageIQ([...state.user.iqResults, result]),
        testsTaken: state.user.testsTaken + 1
      } : null
    }));
  },
  
  getAverageIQ: () => {
    const { iqResults } = get();
    if (iqResults.length === 0) return 0;
    return iqResults.reduce((sum, result) => sum + result.iqScore, 0) / iqResults.length;
  },
  
  loadUserProfile: async () => {
    // Load user profile from API
    const profile = await fetchUserProfile();
    set({ user: profile, iqResults: profile.iqResults });
  }
}));
```

### 4.2 Sử dụng với Context API
```typescript
// src/contexts/IQTestContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { IQTestResults } from '@your-org/iq-test-module';

interface IQTestContextType {
  results: IQTestResults[];
  addResult: (result: IQTestResults) => void;
  clearResults: () => void;
}

const IQTestContext = createContext<IQTestContextType | undefined>(undefined);

export const IQTestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<IQTestResults[]>([]);

  const addResult = (result: IQTestResults) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <IQTestContext.Provider value={{ results, addResult, clearResults }}>
      {children}
    </IQTestContext.Provider>
  );
};

export const useIQTestContext = () => {
  const context = useContext(IQTestContext);
  if (!context) {
    throw new Error('useIQTestContext must be used within IQTestProvider');
  }
  return context;
};
```

## 🎨 Bước 5: Customization

### 5.1 Theme Customization
```typescript
// src/components/CustomIQTest.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

export const CustomIQTest: React.FC = () => {
  return (
    <div className="custom-iq-test">
      <style jsx>{`
        .custom-iq-test {
          --iq-primary-color: #8b5cf6;
          --iq-secondary-color: #06b6d4;
          --iq-success-color: #10b981;
          --iq-warning-color: #f59e0b;
          --iq-error-color: #ef4444;
          --iq-background-color: #f8fafc;
          --iq-text-color: #1e293b;
          --iq-border-radius: 12px;
          --iq-font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      <IQTestInterface 
        config={{
          totalQuestions: 30,
          timeLimit: 1800,
          theme: 'custom',
          onTestComplete: (results) => {
            console.log('Custom themed test completed:', results);
          }
        }}
      />
    </div>
  );
};
```

### 5.2 Localization
```typescript
// src/app/iq-test/page.tsx
import { IQTestInterface } from '@your-org/iq-test-module';

export default function IQTestPage() {
  return (
    <div>
      <IQTestInterface 
        config={{
          language: 'vi', // Vietnamese
          totalQuestions: 30,
          timeLimit: 1800,
          onTestComplete: (results) => {
            console.log('Test completed in Vietnamese:', results);
          }
        }}
      />
    </div>
  );
}
```

## 📊 Bước 6: Analytics Integration

### 6.1 Google Analytics Integration
```typescript
// src/utils/analytics.ts
export const trackIQTestEvent = (event: string, data?: any) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', event, {
      event_category: 'IQ_Test',
      event_label: data?.testType || 'standard',
      value: data?.score || 0,
      ...data
    });
  }
};

// Usage in component
<IQTestInterface 
  config={{
    onTestComplete: (results) => {
      trackIQTestEvent('test_completed', {
        score: results.iqScore,
        accuracy: results.accuracy,
        timeSpent: results.timeSpent
      });
    },
    onTestStart: () => {
      trackIQTestEvent('test_started');
    }
  }}
/>
```

## 🚀 Bước 7: Performance Optimization

### 7.1 Lazy Loading
```typescript
// src/app/iq-test/page.tsx
import dynamic from 'next/dynamic';

const IQTestInterface = dynamic(
  () => import('@your-org/iq-test-module').then(mod => ({ default: mod.IQTestInterface })),
  {
    loading: () => <div>Loading IQ Test...</div>,
    ssr: false
  }
);

export default function IQTestPage() {
  return (
    <div>
      <IQTestInterface />
    </div>
  );
}
```

### 7.2 Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('IQ Test Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">The IQ test encountered an error.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <IQTestInterface />
</ErrorBoundary>
```

## 📋 Checklist Hoàn Thành

### ✅ **Setup & Installation**
- [ ] Install IQ test module
- [ ] Configure TypeScript
- [ ] Set up routing
- [ ] Add error boundaries

### ✅ **Basic Integration**
- [ ] Add to main page
- [ ] Create dedicated page
- [ ] Configure basic settings
- [ ] Test functionality

### ✅ **Advanced Integration**
- [ ] Integrate with user system
- [ ] Add to dashboard
- [ ] Connect with course system
- [ ] Implement state management

### ✅ **Customization**
- [ ] Apply custom theme
- [ ] Add localization
- [ ] Configure analytics
- [ ] Optimize performance

### ✅ **Testing & Deployment**
- [ ] Test all integrations
- [ ] Optimize bundle size
- [ ] Deploy to production
- [ ] Monitor performance

---

*Với kế hoạch này, bạn có thể dễ dàng tích hợp IQ test vào bất kỳ trang Next.js nào một cách linh hoạt và hiệu quả.* 