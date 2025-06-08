#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SUPPORTED_LOCALES = ['en', 'fr', 'ar', 'es', 'de', 'zh', 'ja'];
const NAMESPACES = ['common', 'test', 'questions', 'results', 'gamification'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Extract all translation keys from source code
function extractKeys() {
  log('🔍 Extracting translation keys from source code...', 'blue');
  
  const extractedKeys = new Set();
  const sourceDir = path.join(__dirname, '../src');
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract t('key') patterns
        const tMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);
        if (tMatches) {
          tMatches.forEach(match => {
            const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
            extractedKeys.add(key);
          });
        }
        
        // Extract useTranslation('namespace') patterns
        const nsMatches = content.match(/useTranslation\(['"`]([^'"`]+)['"`]\)/g);
        if (nsMatches) {
          nsMatches.forEach(match => {
            const ns = match.match(/useTranslation\(['"`]([^'"`]+)['"`]\)/)[1];
            if (!NAMESPACES.includes(ns)) {
              log(`⚠️  Unknown namespace found: ${ns} in ${filePath}`, 'yellow');
            }
          });
        }
      }
    }
  }
  
  scanDirectory(sourceDir);
  
  log(`✅ Found ${extractedKeys.size} translation keys`, 'green');
  return Array.from(extractedKeys);
}

// Check translation completeness
function checkCompleteness() {
  log('📊 Checking translation completeness...', 'blue');
  
  const stats = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    stats[locale] = {
      total: 0,
      translated: 0,
      missing: [],
      namespaces: {}
    };
    
    for (const namespace of NAMESPACES) {
      const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);
      
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const keys = flattenObject(content);
          
          stats[locale].namespaces[namespace] = {
            keys: Object.keys(keys).length,
            content: keys
          };
          
          stats[locale].total += Object.keys(keys).length;
          stats[locale].translated += Object.keys(keys).length;
        } catch (error) {
          log(`❌ Error parsing ${filePath}: ${error.message}`, 'red');
        }
      } else {
        log(`⚠️  Missing file: ${filePath}`, 'yellow');
        stats[locale].missing.push(`${namespace}.json`);
      }
    }
  }
  
  // Compare with base locale (English)
  const baseStats = stats['en'];
  
  log('\n📈 Translation Statistics:', 'cyan');
  log('─'.repeat(80), 'cyan');
  
  for (const locale of SUPPORTED_LOCALES) {
    const localeStats = stats[locale];
    const completeness = baseStats.total > 0 
      ? ((localeStats.translated / baseStats.total) * 100).toFixed(1)
      : '0.0';
    
    const status = completeness === '100.0' ? '✅' : 
                  completeness >= '80.0' ? '🟡' : '❌';
    
    log(`${status} ${locale.toUpperCase()}: ${completeness}% (${localeStats.translated}/${baseStats.total})`, 
        completeness === '100.0' ? 'green' : completeness >= '80.0' ? 'yellow' : 'red');
    
    if (localeStats.missing.length > 0) {
      log(`   Missing files: ${localeStats.missing.join(', ')}`, 'red');
    }
  }
  
  return stats;
}

// Find missing translations
function findMissing(targetLocale = null) {
  log('🔍 Finding missing translations...', 'blue');
  
  const baseLocale = 'en';
  const baseTranslations = {};
  
  // Load base translations
  for (const namespace of NAMESPACES) {
    const filePath = path.join(LOCALES_DIR, baseLocale, `${namespace}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        baseTranslations[namespace] = flattenObject(content);
      } catch (error) {
        log(`❌ Error parsing base file ${filePath}: ${error.message}`, 'red');
      }
    }
  }
  
  const locales = targetLocale ? [targetLocale] : SUPPORTED_LOCALES.filter(l => l !== baseLocale);
  
  for (const locale of locales) {
    log(`\n🌍 Missing translations for ${locale.toUpperCase()}:`, 'cyan');
    
    let totalMissing = 0;
    
    for (const namespace of NAMESPACES) {
      const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);
      const baseKeys = baseTranslations[namespace] || {};
      let localeKeys = {};
      
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          localeKeys = flattenObject(content);
        } catch (error) {
          log(`❌ Error parsing ${filePath}: ${error.message}`, 'red');
        }
      }
      
      const missingKeys = Object.keys(baseKeys).filter(key => !(key in localeKeys));
      
      if (missingKeys.length > 0) {
        log(`  📄 ${namespace}.json: ${missingKeys.length} missing keys`, 'yellow');
        missingKeys.forEach(key => {
          log(`    - ${key}`, 'red');
        });
        totalMissing += missingKeys.length;
      }
    }
    
    if (totalMissing === 0) {
      log(`  ✅ No missing translations!`, 'green');
    } else {
      log(`  📊 Total missing: ${totalMissing} keys`, 'red');
    }
  }
}

// Validate translation files
function validateFiles() {
  log('🔍 Validating translation files...', 'blue');
  
  let hasErrors = false;
  
  for (const locale of SUPPORTED_LOCALES) {
    for (const namespace of NAMESPACES) {
      const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);
      
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          JSON.parse(content);
          
          // Check for common issues
          if (content.includes('{{') && !content.includes('}}')) {
            log(`⚠️  Unclosed interpolation in ${filePath}`, 'yellow');
          }
          
          if (content.includes('}}') && !content.includes('{{')) {
            log(`⚠️  Unmatched interpolation in ${filePath}`, 'yellow');
          }
          
        } catch (error) {
          log(`❌ Invalid JSON in ${filePath}: ${error.message}`, 'red');
          hasErrors = true;
        }
      }
    }
  }
  
  if (!hasErrors) {
    log('✅ All translation files are valid!', 'green');
  }
  
  return !hasErrors;
}

// Generate translation template
function generateTemplate(locale, namespace = null) {
  log(`📝 Generating translation template for ${locale}...`, 'blue');
  
  const baseLocale = 'en';
  const namespaces = namespace ? [namespace] : NAMESPACES;
  
  for (const ns of namespaces) {
    const basePath = path.join(LOCALES_DIR, baseLocale, `${ns}.json`);
    const targetPath = path.join(LOCALES_DIR, locale, `${ns}.json`);
    
    if (!fs.existsSync(basePath)) {
      log(`❌ Base file not found: ${basePath}`, 'red');
      continue;
    }
    
    try {
      const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf8'));
      const template = createTranslationTemplate(baseContent);
      
      // Ensure target directory exists
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      fs.writeFileSync(targetPath, JSON.stringify(template, null, 2), 'utf8');
      log(`✅ Created template: ${targetPath}`, 'green');
    } catch (error) {
      log(`❌ Error creating template for ${ns}: ${error.message}`, 'red');
    }
  }
}

// Create translation template with empty values
function createTranslationTemplate(obj, prefix = '') {
  const template = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      template[key] = createTranslationTemplate(value, `${prefix}${key}.`);
    } else {
      template[key] = `TODO: Translate "${value}"`;
    }
  }
  
  return template;
}

// Flatten nested object to dot notation
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

// Sync translations (copy structure from base locale)
function syncTranslations(targetLocale) {
  log(`🔄 Syncing translations for ${targetLocale}...`, 'blue');
  
  const baseLocale = 'en';
  
  for (const namespace of NAMESPACES) {
    const basePath = path.join(LOCALES_DIR, baseLocale, `${namespace}.json`);
    const targetPath = path.join(LOCALES_DIR, targetLocale, `${namespace}.json`);
    
    if (!fs.existsSync(basePath)) {
      log(`⚠️  Base file not found: ${basePath}`, 'yellow');
      continue;
    }
    
    try {
      const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf8'));
      let targetContent = {};
      
      if (fs.existsSync(targetPath)) {
        targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      }
      
      const synced = syncObject(baseContent, targetContent);
      
      fs.writeFileSync(targetPath, JSON.stringify(synced, null, 2), 'utf8');
      log(`✅ Synced: ${targetPath}`, 'green');
    } catch (error) {
      log(`❌ Error syncing ${namespace}: ${error.message}`, 'red');
    }
  }
}

// Sync object structure while preserving existing translations
function syncObject(base, target) {
  const synced = {};
  
  for (const [key, value] of Object.entries(base)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      synced[key] = syncObject(value, target[key] || {});
    } else {
      synced[key] = target[key] || `TODO: Translate "${value}"`;
    }
  }
  
  return synced;
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    log('🌍 i18n Tools - Translation Management CLI', 'cyan');
    log('─'.repeat(50), 'cyan');
    log('Usage: node scripts/i18n-tools.js <command> [options]', 'blue');
    log('');
    log('Commands:', 'yellow');
    log('  extract          Extract translation keys from source code');
    log('  check            Check translation completeness');
    log('  missing [locale] Find missing translations');
    log('  validate         Validate translation files');
    log('  template <locale> [namespace] Generate translation template');
    log('  sync <locale>    Sync translation structure');
    log('');
    log('Examples:', 'green');
    log('  node scripts/i18n-tools.js check');
    log('  node scripts/i18n-tools.js missing fr');
    log('  node scripts/i18n-tools.js template es');
    log('  node scripts/i18n-tools.js sync ar');
    return;
  }
  
  switch (command) {
    case 'extract':
      extractKeys();
      break;
      
    case 'check':
      checkCompleteness();
      break;
      
    case 'missing':
      findMissing(args[1]);
      break;
      
    case 'validate':
      validateFiles();
      break;
      
    case 'template':
      if (!args[1]) {
        log('❌ Please specify a locale', 'red');
        return;
      }
      generateTemplate(args[1], args[2]);
      break;
      
    case 'sync':
      if (!args[1]) {
        log('❌ Please specify a locale', 'red');
        return;
      }
      syncTranslations(args[1]);
      break;
      
    default:
      log(`❌ Unknown command: ${command}`, 'red');
      log('Run without arguments to see available commands', 'blue');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  extractKeys,
  checkCompleteness,
  findMissing,
  validateFiles,
  generateTemplate,
  syncTranslations
}; 