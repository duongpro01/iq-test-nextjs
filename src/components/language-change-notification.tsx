"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { useTestStore } from '@/store/test-store';

export function LanguageChangeNotification() {
  const { t, i18n } = useTranslation('common');
  const { currentSession, resetTest } = useTestStore();
  const [showNotification, setShowNotification] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState<string | null>(null);

  useEffect(() => {
    // Track the initial language when test starts
    if (currentSession && !initialLanguage) {
      setInitialLanguage(i18n.language);
    }
    
    // Clear initial language when test ends
    if (!currentSession) {
      setInitialLanguage(null);
      setShowNotification(false);
    }
  }, [currentSession, initialLanguage, i18n.language]);

  useEffect(() => {
    const handleLanguageChange = () => {
      // Show notification if language changed during active test
      if (currentSession && initialLanguage && i18n.language !== initialLanguage) {
        setShowNotification(true);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [currentSession, initialLanguage, i18n]);

  const handleRestartTest = () => {
    resetTest();
    setShowNotification(false);
    setInitialLanguage(null);
  };

  const handleDismiss = () => {
    setShowNotification(false);
    setInitialLanguage(i18n.language); // Update initial language to current
  };

  if (!currentSession || !showNotification) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card className="shadow-lg border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                  Language Changed
                </h3>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  To see questions in the new language, please restart the test.
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleRestartTest}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Restart Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
                  >
                    Continue
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="flex-shrink-0 h-6 w-6 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-400 dark:hover:text-orange-200 dark:hover:bg-orange-900/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
