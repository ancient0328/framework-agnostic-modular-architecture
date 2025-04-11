/**
 * Internationalization module for msyn
 * 
 * Provides language switching and message translation functionality
 */

const ja = require('./ja');
const en = require('./en');

const messages = {
  ja,
  en
};

// Default language is English
let currentLanguage = 'en';

/**
 * Set the current language
 * @param {string} lang - Language code ('en' or 'ja')
 */
function setLanguage(lang) {
  if (messages[lang]) {
    currentLanguage = lang;
  } else {
    console.warn(`Language "${lang}" not found. Using default "en" instead.`);
    currentLanguage = 'en';
  }
}

/**
 * Translate a message key to the current language
 * @param {string} key - Message key to translate
 * @param {...any} args - Arguments to replace placeholders in the message
 * @returns {string} - Translated message
 */
function t(key, ...args) {
  const message = messages[currentLanguage][key] || messages.en[key] || key;
  
  // Replace placeholders ({0}, {1}, etc.) with arguments
  return args.reduce((str, arg, i) => str.replace(new RegExp(`\\{${i}\\}`, 'g'), arg), message);
}

/**
 * Get the name of the current language
 * @returns {string} - Current language name
 */
function getCurrentLanguageName() {
  return currentLanguage === 'ja' ? '日本語' : 'English';
}

module.exports = {
  setLanguage,
  t,
  getCurrentLanguageName,
  supportedLanguages: Object.keys(messages)
};
