import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'हिंदी', nativeName: 'हिंदी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', nativeName: 'ਪੰਜਾਬੀ' },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Fallback function for translations
  const translate = (key: string, fallback?: string) => {
    const translation = t(key);
    return translation === key ? (fallback || key) : translation;
  };

  const handleLanguageChange = (languageCode: string) => {
    try {
      i18n.changeLanguage(languageCode);
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-purple-50"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{translate('common.language', 'Language')}</span>
        <span className="font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-4 py-3 text-left hover:bg-purple-50 first:rounded-t-lg last:rounded-b-lg ${
                i18n.language === language.code
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-sm text-gray-500">{language.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
