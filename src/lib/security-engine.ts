import { UserAnswer, TestSession } from '@/types';

// Security monitoring interfaces
export interface SecurityMetrics {
  focusEvents: FocusEvent[];
  mouseMovements: MouseMovement[];
  keyboardEvents: KeyboardEvent[];
  tabSwitches: number;
  windowBlurs: number;
  suspiciousPatterns: SuspiciousPattern[];
  confidenceScore: number; // 0-1, where 1 is most confident the test is legitimate
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface FocusEvent {
  type: 'blur' | 'focus' | 'visibility_change';
  timestamp: number;
  duration?: number; // for blur events
  questionId?: string;
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  questionId: string;
  velocity: number;
  acceleration: number;
}

export interface KeyboardEvent {
  type: 'keydown' | 'keyup' | 'paste' | 'copy';
  key?: string;
  timestamp: number;
  questionId: string;
  isBlocked: boolean;
}

export interface SuspiciousPattern {
  type: 'rapid_answers' | 'perfect_accuracy' | 'unusual_timing' | 'focus_loss' | 'mouse_anomaly' | 'keyboard_anomaly';
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: unknown[];
  timestamp: number;
  questionIds: string[];
}

export interface SecurityConfig {
  enableMouseTracking: boolean;
  enableFocusMonitoring: boolean;
  enableKeyboardBlocking: boolean;
  maxBlurDuration: number; // seconds
  maxTabSwitches: number;
  suspiciousSpeedThreshold: number; // seconds
  mouseVelocityThreshold: number;
  enableRealTimeWarnings: boolean;
}

class SecurityEngine {
  private config: SecurityConfig;
  private metrics: SecurityMetrics;
  private startTime: number = 0;
  private currentQuestionId: string = '';
  private mouseTrackingInterval: number | null = null;
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private lastMouseTime: number = 0;

  constructor(config: SecurityConfig = {
    enableMouseTracking: true,
    enableFocusMonitoring: true,
    enableKeyboardBlocking: true,
    maxBlurDuration: 30,
    maxTabSwitches: 3,
    suspiciousSpeedThreshold: 5,
    mouseVelocityThreshold: 1000,
    enableRealTimeWarnings: true
  }) {
    this.config = config;
    this.metrics = this.initializeMetrics();
    this.setupEventListeners();
  }

  private initializeMetrics(): SecurityMetrics {
    return {
      focusEvents: [],
      mouseMovements: [],
      keyboardEvents: [],
      tabSwitches: 0,
      windowBlurs: 0,
      suspiciousPatterns: [],
      confidenceScore: 1.0,
      riskLevel: 'low'
    };
  }

  /**
   * Initialize security monitoring
   */
  startMonitoring(sessionId: string): void {
    this.startTime = Date.now();
    this.metrics = this.initializeMetrics();
    
    if (this.config.enableMouseTracking) {
      this.startMouseTracking();
    }
    
    console.log(`Security monitoring started for session: ${sessionId}`);
  }

  /**
   * Stop security monitoring
   */
  stopMonitoring(): SecurityMetrics {
    if (this.mouseTrackingInterval) {
      clearInterval(this.mouseTrackingInterval);
      this.mouseTrackingInterval = null;
    }
    
    this.analyzeSecurityMetrics();
    return this.metrics;
  }

  /**
   * Set current question for context
   */
  setCurrentQuestion(questionId: string): void {
    this.currentQuestionId = questionId;
  }

  /**
   * Setup event listeners for security monitoring
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Focus/blur monitoring
    if (this.config.enableFocusMonitoring) {
      window.addEventListener('blur', this.handleWindowBlur.bind(this));
      window.addEventListener('focus', this.handleWindowFocus.bind(this));
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    // Keyboard monitoring
    if (this.config.enableKeyboardBlocking) {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      document.addEventListener('paste', this.handlePaste.bind(this));
      document.addEventListener('copy', this.handleCopy.bind(this));
    }

    // Context menu blocking
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this));

    // Developer tools detection
    this.setupDevToolsDetection();
  }

  /**
   * Handle window blur events
   */
  private handleWindowBlur(): void {
    const event: FocusEvent = {
      type: 'blur',
      timestamp: Date.now(),
      questionId: this.currentQuestionId
    };
    
    this.metrics.focusEvents.push(event);
    this.metrics.windowBlurs++;
    
    if (this.config.enableRealTimeWarnings && this.metrics.windowBlurs > this.config.maxTabSwitches) {
      this.addSuspiciousPattern({
        type: 'focus_loss',
        severity: 'high',
        description: `Excessive window blur events (${this.metrics.windowBlurs})`,
        evidence: [event],
        timestamp: Date.now(),
        questionIds: [this.currentQuestionId]
      });
    }
  }

  /**
   * Handle window focus events
   */
  private handleWindowFocus(): void {
    const lastBlur = this.metrics.focusEvents
      .filter(e => e.type === 'blur')
      .pop();
    
    if (lastBlur) {
      lastBlur.duration = Date.now() - lastBlur.timestamp;
      
      if (lastBlur.duration > this.config.maxBlurDuration * 1000) {
        this.addSuspiciousPattern({
          type: 'focus_loss',
          severity: 'medium',
          description: `Extended focus loss: ${Math.round(lastBlur.duration / 1000)}s`,
          evidence: [lastBlur],
          timestamp: Date.now(),
          questionIds: [this.currentQuestionId]
        });
      }
    }
    
    this.metrics.focusEvents.push({
      type: 'focus',
      timestamp: Date.now(),
      questionId: this.currentQuestionId
    });
  }

  /**
   * Handle visibility change events
   */
  private handleVisibilityChange(): void {
    const event: FocusEvent = {
      type: 'visibility_change',
      timestamp: Date.now(),
      questionId: this.currentQuestionId
    };
    
    this.metrics.focusEvents.push(event);
    
    if (document.hidden) {
      this.metrics.tabSwitches++;
    }
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown(event: globalThis.KeyboardEvent): void {
    const blockedKeys = [
      'F12', // Developer tools
      'F5',  // Refresh
      'F11', // Fullscreen
    ];
    
    const blockedCombinations = [
      { ctrl: true, shift: true, key: 'I' }, // Dev tools
      { ctrl: true, shift: true, key: 'J' }, // Console
      { ctrl: true, shift: true, key: 'C' }, // Inspector
      { ctrl: true, key: 'U' },              // View source
      { ctrl: true, key: 'R' },              // Refresh
      { ctrl: true, key: 'F5' },             // Hard refresh
      { alt: true, key: 'Tab' },             // Alt+Tab
    ];
    
    let isBlocked = false;
    
    // Check single keys
    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
      isBlocked = true;
    }
    
    // Check key combinations
    blockedCombinations.forEach(combo => {
      if (
        (combo.ctrl === undefined || combo.ctrl === event.ctrlKey) &&
        (combo.shift === undefined || combo.shift === event.shiftKey) &&
        (combo.alt === undefined || combo.alt === event.altKey) &&
        combo.key === event.key
      ) {
        event.preventDefault();
        isBlocked = true;
      }
    });
    
    const keyboardEvent: KeyboardEvent = {
      type: 'keydown',
      key: event.key,
      timestamp: Date.now(),
      questionId: this.currentQuestionId,
      isBlocked
    };
    
    this.metrics.keyboardEvents.push(keyboardEvent);
    
    if (isBlocked) {
      this.addSuspiciousPattern({
        type: 'keyboard_anomaly',
        severity: 'medium',
        description: `Blocked keyboard shortcut: ${event.key}`,
        evidence: [keyboardEvent],
        timestamp: Date.now(),
        questionIds: [this.currentQuestionId]
      });
    }
  }

  /**
   * Handle paste events
   */
  private handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    
    const pasteEvent: KeyboardEvent = {
      type: 'paste',
      timestamp: Date.now(),
      questionId: this.currentQuestionId,
      isBlocked: true
    };
    
    this.metrics.keyboardEvents.push(pasteEvent);
    
    this.addSuspiciousPattern({
      type: 'keyboard_anomaly',
      severity: 'high',
      description: 'Attempted to paste content',
      evidence: [pasteEvent],
      timestamp: Date.now(),
      questionIds: [this.currentQuestionId]
    });
  }

  /**
   * Handle copy events
   */
  private handleCopy(event: ClipboardEvent): void {
    event.preventDefault();
    
    const copyEvent: KeyboardEvent = {
      type: 'copy',
      timestamp: Date.now(),
      questionId: this.currentQuestionId,
      isBlocked: true
    };
    
    this.metrics.keyboardEvents.push(copyEvent);
    
    this.addSuspiciousPattern({
      type: 'keyboard_anomaly',
      severity: 'medium',
      description: 'Attempted to copy content',
      evidence: [copyEvent],
      timestamp: Date.now(),
      questionIds: [this.currentQuestionId]
    });
  }

  /**
   * Handle context menu events
   */
  private handleContextMenu(event: MouseEvent): void {
    event.preventDefault();
    
    this.addSuspiciousPattern({
      type: 'mouse_anomaly',
      severity: 'low',
      description: 'Right-click attempted',
      evidence: [{ x: event.clientX, y: event.clientY, timestamp: Date.now() }],
      timestamp: Date.now(),
      questionIds: [this.currentQuestionId]
    });
  }

  /**
   * Start mouse movement tracking
   */
  private startMouseTracking(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Sample mouse position every 100ms for velocity calculation
    this.mouseTrackingInterval = window.setInterval(() => {
      this.calculateMouseMetrics();
    }, 100);
  }

  /**
   * Handle mouse movement
   */
  private handleMouseMove(event: MouseEvent): void {
    const now = Date.now();
    const movement: MouseMovement = {
      x: event.clientX,
      y: event.clientY,
      timestamp: now,
      questionId: this.currentQuestionId,
      velocity: 0,
      acceleration: 0
    };
    
    // Calculate velocity if we have a previous position
    if (this.lastMouseTime > 0) {
      const deltaTime = now - this.lastMouseTime;
      const deltaX = event.clientX - this.lastMousePosition.x;
      const deltaY = event.clientY - this.lastMousePosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      movement.velocity = distance / (deltaTime / 1000); // pixels per second
    }
    
    this.metrics.mouseMovements.push(movement);
    this.lastMousePosition = { x: event.clientX, y: event.clientY };
    this.lastMouseTime = now;
    
    // Check for suspicious mouse velocity
    if (movement.velocity > this.config.mouseVelocityThreshold) {
      this.addSuspiciousPattern({
        type: 'mouse_anomaly',
        severity: 'low',
        description: `Unusually fast mouse movement: ${Math.round(movement.velocity)} px/s`,
        evidence: [movement],
        timestamp: now,
        questionIds: [this.currentQuestionId]
      });
    }
  }

  /**
   * Calculate mouse movement metrics
   */
  private calculateMouseMetrics(): void {
    const recentMovements = this.metrics.mouseMovements.slice(-10);
    if (recentMovements.length < 2) return;
    
    // Calculate acceleration
    const velocities = recentMovements.map(m => m.velocity);
    for (let i = 1; i < velocities.length; i++) {
      const acceleration = Math.abs(velocities[i] - velocities[i - 1]);
      recentMovements[i].acceleration = acceleration;
    }
  }

  /**
   * Setup developer tools detection
   */
  private setupDevToolsDetection(): void {
    if (typeof window === 'undefined') return;

    // Method 1: Console detection
    const devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.addSuspiciousPattern({
            type: 'keyboard_anomaly',
            severity: 'high',
            description: 'Developer tools detected',
            evidence: [{ 
              outerHeight: window.outerHeight, 
              innerHeight: window.innerHeight,
              outerWidth: window.outerWidth,
              innerWidth: window.innerWidth
            }],
            timestamp: Date.now(),
            questionIds: [this.currentQuestionId]
          });
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Method 2: Console.log detection
    const originalLog = console.log;
    console.log = function(...args) {
      // If console is open, this will be called
      if (args.length === 0) {
        // This is our detection call
        return;
      }
      originalLog.apply(console, args);
    };

    // Trigger detection
    setInterval(() => {
      console.log();
    }, 1000);
  }

  /**
   * Add suspicious pattern
   */
  private addSuspiciousPattern(pattern: SuspiciousPattern): void {
    this.metrics.suspiciousPatterns.push(pattern);
    this.updateRiskLevel();
    
    if (this.config.enableRealTimeWarnings) {
      this.showSecurityWarning(pattern);
    }
  }

  /**
   * Update risk level based on patterns
   */
  private updateRiskLevel(): void {
    const patterns = this.metrics.suspiciousPatterns;
    const highSeverityCount = patterns.filter(p => p.severity === 'high').length;
    const mediumSeverityCount = patterns.filter(p => p.severity === 'medium').length;
    
    let riskScore = 0;
    riskScore += highSeverityCount * 3;
    riskScore += mediumSeverityCount * 2;
    riskScore += patterns.filter(p => p.severity === 'low').length * 1;
    
    if (riskScore >= 10) {
      this.metrics.riskLevel = 'critical';
      this.metrics.confidenceScore = 0.1;
    } else if (riskScore >= 6) {
      this.metrics.riskLevel = 'high';
      this.metrics.confidenceScore = 0.3;
    } else if (riskScore >= 3) {
      this.metrics.riskLevel = 'medium';
      this.metrics.confidenceScore = 0.6;
    } else {
      this.metrics.riskLevel = 'low';
      this.metrics.confidenceScore = 0.9;
    }
  }

  /**
   * Show security warning
   */
  private showSecurityWarning(pattern: SuspiciousPattern): void {
    if (pattern.severity === 'high' || pattern.severity === 'medium') {
      // This would show a warning to the user
      console.warn(`Security Alert: ${pattern.description}`);
    }
  }

  /**
   * Analyze answer patterns for cheating
   */
  analyzeAnswerPatterns(answers: UserAnswer[]): SuspiciousPattern[] {
    const patterns: SuspiciousPattern[] = [];
    
    // Check for rapid answers
    const rapidAnswers = answers.filter(a => a.responseTime < this.config.suspiciousSpeedThreshold);
    if (rapidAnswers.length >= 3) {
      patterns.push({
        type: 'rapid_answers',
        severity: 'medium',
        description: `${rapidAnswers.length} answers completed in under ${this.config.suspiciousSpeedThreshold}s`,
        evidence: rapidAnswers,
        timestamp: Date.now(),
        questionIds: rapidAnswers.map(a => a.questionId)
      });
    }
    
    // Check for perfect accuracy with rapid answers
    const correctRapidAnswers = rapidAnswers.filter(a => a.isCorrect);
    if (correctRapidAnswers.length >= 3) {
      patterns.push({
        type: 'perfect_accuracy',
        severity: 'high',
        description: `Perfect accuracy on ${correctRapidAnswers.length} rapid answers`,
        evidence: correctRapidAnswers,
        timestamp: Date.now(),
        questionIds: correctRapidAnswers.map(a => a.questionId)
      });
    }
    
    // Check for unusual timing patterns
    const timings = answers.map(a => a.responseTime);
    const avgTiming = timings.reduce((sum, t) => sum + t, 0) / timings.length;
    const variance = timings.reduce((sum, t) => sum + Math.pow(t - avgTiming, 2), 0) / timings.length;
    
    if (variance < 10 && answers.length >= 5) { // Very consistent timing
      patterns.push({
        type: 'unusual_timing',
        severity: 'medium',
        description: `Unusually consistent response times (variance: ${variance.toFixed(2)})`,
        evidence: answers,
        timestamp: Date.now(),
        questionIds: answers.map(a => a.questionId)
      });
    }
    
    return patterns;
  }

  /**
   * Generate security report
   */
  generateSecurityReport(): {
    summary: string;
    riskLevel: string;
    confidenceScore: number;
    recommendations: string[];
    details: SecurityMetrics;
  } {
    const patterns = this.metrics.suspiciousPatterns;
    
    let summary = '';
    const recommendations: string[] = [];
    
    if (this.metrics.riskLevel === 'critical') {
      summary = 'Critical security violations detected. Test results should be invalidated.';
      recommendations.push('Require supervised retesting');
      recommendations.push('Implement additional security measures');
    } else if (this.metrics.riskLevel === 'high') {
      summary = 'Significant security concerns detected. Results may be compromised.';
      recommendations.push('Manual review of test session required');
      recommendations.push('Consider partial credit or retesting');
    } else if (this.metrics.riskLevel === 'medium') {
      summary = 'Some security concerns detected. Results should be reviewed.';
      recommendations.push('Flag for manual review');
      recommendations.push('Monitor for patterns in future tests');
    } else {
      summary = 'No significant security violations detected.';
      recommendations.push('Results appear legitimate');
    }
    
    return {
      summary,
      riskLevel: this.metrics.riskLevel,
      confidenceScore: this.metrics.confidenceScore,
      recommendations,
      details: this.metrics
    };
  }

  /**
   * Get current security metrics
   */
  getCurrentMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  /**
   * Analyze complete test session
   */
  analyzeSession(session: TestSession, answers: UserAnswer[]): SecurityMetrics {
    // Analyze answer patterns
    const answerPatterns = this.analyzeAnswerPatterns(answers);
    this.metrics.suspiciousPatterns.push(...answerPatterns);
    
    // Final analysis
    this.analyzeSecurityMetrics();
    
    return this.metrics;
  }

  /**
   * Perform final security analysis
   */
  private analyzeSecurityMetrics(): void {
    // Update confidence score based on all metrics
    this.updateRiskLevel();
    
    // Additional analysis based on session duration, etc.
    const sessionDuration = Date.now() - this.startTime;
    const avgTimePerQuestion = sessionDuration / Math.max(1, this.metrics.mouseMovements.length);
    
    if (avgTimePerQuestion < 10000) { // Less than 10 seconds per question
      this.addSuspiciousPattern({
        type: 'unusual_timing',
        severity: 'medium',
        description: `Very fast completion: ${Math.round(avgTimePerQuestion / 1000)}s per question`,
        evidence: [{ sessionDuration, avgTimePerQuestion }],
        timestamp: Date.now(),
        questionIds: []
      });
    }
  }
}

export const securityEngine = new SecurityEngine(); 