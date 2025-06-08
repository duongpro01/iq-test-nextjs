"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  ChevronDown, 
  Check, 
  Monitor,
  Smartphone,
  Languages
} from 'lucide-react';
import { 
  SupportedLocale, 
  LANGUAGES, 
  LanguageInfo 
} from '@/types/i18n';
import { 
  getCurrentLocale, 
  changeLanguage, 
  isRTL,
  loadFontsForLocale 
} from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'grid' | 'compact';
  showFlags?: boolean;
  showNativeNames?: boolean;
  autoDetect?: boolean;
  className?: string;
}

export function LanguageSelector({
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true,
  autoDetect = true,
  className = ''
}: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('en');
  const [isChanging, setIsChanging] = useState(false);
  const [detectedLocale, setDetectedLocale] = useState<SupportedLocale | null>(null);

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
    
    // Auto-detect browser language
    if (autoDetect) {
      const browserLang = navigator.language.split('-')[0] as SupportedLocale;
      if (Object.keys(LANGUAGES).includes(browserLang)) {
        setDetectedLocale(browserLang);
      }
    }
  }, [autoDetect]);

  const handleLanguageChange = async (locale: SupportedLocale) => {
    if (locale === currentLocale) return;
    
    setIsChanging(true);
    setIsOpen(false);
    
    try {
      // Load fonts for the new locale
      await loadFontsForLocale(locale);
      
      // Change language
      await changeLanguage(locale);
      
      // Update state
      setCurrentLocale(locale);
      
      // Trigger a re-render to update RTL layout
      window.dispatchEvent(new Event('languageChanged'));
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const LanguageOption = ({ 
    language, 
    isSelected, 
    isDetected = false 
  }: { 
    language: LanguageInfo; 
    isSelected: boolean;
    isDetected?: boolean;
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleLanguageChange(language.code)}
      className={`
        w-full flex items-center gap-3 p-3 rounded-lg transition-all
        ${isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted/50'
        }
        ${isRTL(language.code) ? 'flex-row-reverse text-right' : 'text-left'}
      `}
      disabled={isChanging}
    >
      {showFlags && (
        <span className="text-xl" role="img" aria-label={language.name}>
          {language.flag}
        </span>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {showNativeNames ? language.nativeName : language.name}
        </div>
        {showNativeNames && language.nativeName !== language.name && (
          <div className="text-xs opacity-70 truncate">
            {language.name}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {isDetected && (
          <Badge variant="secondary" className="text-xs">
            {t('language.auto_detect')}
          </Badge>
        )}
        
        {language.rtl && (
          <Badge variant="outline" className="text-xs">
            RTL
          </Badge>
        )}
        
        {isSelected && (
          <Check className="w-4 h-4" />
        )}
      </div>
    </motion.button>
  );

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative ${className}`}
        disabled={isChanging}
      >
        {isChanging ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {showFlags && (
              <span className="mr-2">{LANGUAGES[currentLocale].flag}</span>
            )}
            <span className="hidden sm:inline">
              {LANGUAGES[currentLocale].code.toUpperCase()}
            </span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 z-50"
            >
              <Card className="w-64 shadow-lg">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {Object.values(LANGUAGES).map((language) => (
                      <LanguageOption
                        key={language.code}
                        language={language}
                        isSelected={language.code === currentLocale}
                        isDetected={language.code === detectedLocale}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          <h3 className="text-lg font-semibold">
            {t('language.selector')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(LANGUAGES).map((language) => (
            <LanguageOption
              key={language.code}
              language={language}
              isSelected={language.code === currentLocale}
              isDetected={language.code === detectedLocale}
            />
          ))}
        </div>
        
        {detectedLocale && detectedLocale !== currentLocale && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
          >
            <Monitor className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {t('language.browser_default')}: {LANGUAGES[detectedLocale].nativeName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLanguageChange(detectedLocale)}
              className="ml-auto"
            >
              {t('actions.switch')}
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        disabled={isChanging}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {isChanging ? (
            <span>{t('status.loading')}</span>
          ) : (
            <>
              {showFlags && (
                <span>{LANGUAGES[currentLocale].flag}</span>
              )}
              <span>
                {showNativeNames 
                  ? LANGUAGES[currentLocale].nativeName 
                  : LANGUAGES[currentLocale].name
                }
              </span>
            </>
          )}
        </div>
        <ChevronDown className="w-4 h-4" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="shadow-lg">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {Object.values(LANGUAGES).map((language) => (
                    <LanguageOption
                      key={language.code}
                      language={language}
                      isSelected={language.code === currentLocale}
                      isDetected={language.code === detectedLocale}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for language-aware formatting
export function useLocaleFormatting() {
  const currentLocale = getCurrentLocale();
  
  return {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => 
      new Intl.NumberFormat(currentLocale, options).format(value),
    
    formatPercent: (value: number) => 
      new Intl.NumberFormat(currentLocale, { 
        style: 'percent', 
        maximumFractionDigits: 1 
      }).format(value),
    
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => 
      new Intl.DateTimeFormat(currentLocale, options).format(new Date(date)),
    
    formatTime: (date: Date | string | number) => 
      new Intl.DateTimeFormat(currentLocale, { 
        timeStyle: 'short' 
      }).format(new Date(date)),
    
    formatCurrency: (value: number, currency = 'USD') => 
      new Intl.NumberFormat(currentLocale, { 
        style: 'currency', 
        currency 
      }).format(value),
    
    isRTL: isRTL(currentLocale),
    locale: currentLocale,
    direction: isRTL(currentLocale) ? 'rtl' : 'ltr'
  };
} 