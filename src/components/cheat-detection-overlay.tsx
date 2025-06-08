'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  MousePointer, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { securityEngine } from '@/lib/security-engine';

interface CheatDetectionOverlayProps {
  isActive: boolean;
  onSecurityEvent?: (event: SecurityEvent) => void;
  showDetailedMetrics?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface SecurityEvent {
  type: 'focus_lost' | 'tab_switch' | 'suspicious_mouse' | 'dev_tools' | 'copy_paste' | 'fast_response';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: string;
}

interface SecurityMetrics {
  confidenceScore: number;
  focusEvents: number;
  tabSwitches: number;
  suspiciousMouseEvents: number;
  devToolsDetections: number;
  totalEvents: number;
  sessionDuration: number;
}

const CONFIDENCE_THRESHOLDS = {
  excellent: 0.9,
  good: 0.7,
  fair: 0.5,
  poor: 0.3
};

const SECURITY_LEVELS = {
  excellent: { color: 'text-green-600', bg: 'bg-green-100', icon: ShieldCheck },
  good: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Shield },
  fair: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: ShieldAlert },
  poor: { color: 'text-red-600', bg: 'bg-red-100', icon: ShieldAlert }
};

export function CheatDetectionOverlay({ 
  isActive, 
  onSecurityEvent, 
  showDetailedMetrics = false,
  position = 'top-right'
}: CheatDetectionOverlayProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    confidenceScore: 1.0,
    focusEvents: 0,
    tabSwitches: 0,
    suspiciousMouseEvents: 0,
    devToolsDetections: 0,
    totalEvents: 0,
    sessionDuration: 0
  });
  
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Update metrics from security engine
  useEffect(() => {
    if (!isActive) return;

    const updateMetrics = () => {
             const engineMetrics = securityEngine.getCurrentMetrics();
      const sessionDuration = (Date.now() - sessionStartTime) / 1000;
      
             setMetrics({
         confidenceScore: engineMetrics.confidenceScore,
         focusEvents: engineMetrics.focusEvents.length,
         tabSwitches: engineMetrics.tabSwitches,
         suspiciousMouseEvents: engineMetrics.mouseMovements.length,
         devToolsDetections: engineMetrics.suspiciousPatterns.filter(p => p.type === 'keyboard_anomaly').length,
         totalEvents: engineMetrics.suspiciousPatterns.length,
         sessionDuration
       });
    };

    // Update every second
    const interval = setInterval(updateMetrics, 1000);
    
    // Initial update
    updateMetrics();

    return () => clearInterval(interval);
  }, [isActive, sessionStartTime]);

  // Listen for security events
  useEffect(() => {
    if (!isActive) return;

    const handleSecurityEvent = (event: CustomEvent) => {
      const securityEvent: SecurityEvent = {
        type: event.detail.type,
        severity: event.detail.severity,
        timestamp: new Date(),
        details: event.detail.message
      };

      setRecentEvents(prev => [securityEvent, ...prev.slice(0, 4)]);
      onSecurityEvent?.(securityEvent);
    };

    window.addEventListener('security-event', handleSecurityEvent as EventListener);
    
    return () => {
      window.removeEventListener('security-event', handleSecurityEvent as EventListener);
    };
  }, [isActive, onSecurityEvent]);

  const getSecurityLevel = (score: number): keyof typeof SECURITY_LEVELS => {
    if (score >= CONFIDENCE_THRESHOLDS.excellent) return 'excellent';
    if (score >= CONFIDENCE_THRESHOLDS.good) return 'good';
    if (score >= CONFIDENCE_THRESHOLDS.fair) return 'fair';
    return 'poor';
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPositionClasses = (): string => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const securityLevel = getSecurityLevel(metrics.confidenceScore);
  const SecurityIcon = SECURITY_LEVELS[securityLevel].icon;

  if (!isActive) return null;

  return (
    <div className={getPositionClasses()}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-80 shadow-lg border-2 border-primary/20">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${SECURITY_LEVELS[securityLevel].bg}`}>
                    <SecurityIcon className={`w-4 h-4 ${SECURITY_LEVELS[securityLevel].color}`} />
                  </div>
                  <span className="font-semibold text-sm">Security Monitor</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>

              {/* Confidence Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Confidence Score</span>
                  <Badge 
                    variant={securityLevel === 'excellent' || securityLevel === 'good' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {Math.round(metrics.confidenceScore * 100)}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.confidenceScore * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{metrics.totalEvents}</div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{formatDuration(metrics.sessionDuration)}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <AnimatePresence>
                {(isExpanded || showDetailedMetrics) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {/* Security Metrics */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Security Metrics</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-3 h-3 text-orange-500" />
                          <span>Focus Lost: {metrics.focusEvents}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span>Tab Switches: {metrics.tabSwitches}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MousePointer className="w-3 h-3 text-blue-500" />
                          <span>Mouse Events: {metrics.suspiciousMouseEvents}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>Dev Tools: {metrics.devToolsDetections}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Events */}
                    {recentEvents.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Recent Events</h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {recentEvents.map((event, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2 text-xs p-2 rounded bg-muted/50"
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                event.severity === 'critical' ? 'bg-red-500' :
                                event.severity === 'high' ? 'bg-orange-500' :
                                event.severity === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`} />
                              <span className="flex-1 truncate">{event.details}</span>
                              <span className="text-muted-foreground">
                                {event.timestamp.toLocaleTimeString().slice(0, 5)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Security Tips */}
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-3 h-3 text-blue-600 mt-0.5" />
                        <div className="text-xs text-blue-800">
                          <div className="font-medium mb-1">Security Tips:</div>
                          <ul className="space-y-0.5 text-blue-700">
                            <li>• Keep this tab focused</li>
                            <li>• Avoid switching tabs</li>
                            <li>• Don't use developer tools</li>
                            <li>• Take your time to think</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security Status */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  {securityLevel === 'excellent' && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">Excellent Security</span>
                    </>
                  )}
                  {securityLevel === 'good' && (
                    <>
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">Good Security</span>
                    </>
                  )}
                  {securityLevel === 'fair' && (
                    <>
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">Fair Security</span>
                    </>
                  )}
                  {securityLevel === 'poor' && (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-medium">Poor Security</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Security Event Dispatcher
export const dispatchSecurityEvent = (
  type: SecurityEvent['type'], 
  severity: SecurityEvent['severity'], 
  message: string
): void => {
  const event = new CustomEvent('security-event', {
    detail: { type, severity, message }
  });
  window.dispatchEvent(event);
};

// Hook for easy integration
export const useCheatDetection = (isActive: boolean = true) => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    confidenceScore: 1.0,
    focusEvents: 0,
    tabSwitches: 0,
    suspiciousMouseEvents: 0,
    devToolsDetections: 0,
    totalEvents: 0,
    sessionDuration: 0
  });

  useEffect(() => {
    if (!isActive) return;

         // Initialize security monitoring
     securityEngine.startMonitoring('session_' + Date.now());

     const updateMetrics = () => {
       const metrics = securityEngine.getCurrentMetrics();
      setSecurityMetrics({
        confidenceScore: metrics.confidenceScore,
        focusEvents: metrics.focusEvents.length,
        tabSwitches: metrics.tabSwitches,
        suspiciousMouseEvents: metrics.mouseMovements?.length || 0,
        devToolsDetections: metrics.suspiciousPatterns?.filter(p => p.type === 'keyboard_anomaly').length || 0,
        totalEvents: metrics.suspiciousPatterns?.length || 0,
        sessionDuration: Date.now() - (metrics.focusEvents[0]?.timestamp || Date.now())
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics();

    return () => {
      clearInterval(interval);
      securityEngine.stopMonitoring();
    };
  }, [isActive]);

  return {
    securityMetrics,
    dispatchSecurityEvent,
    isSecure: securityMetrics.confidenceScore > CONFIDENCE_THRESHOLDS.good
  };
}; 