import { geminiService } from '../lib/gemini';

export type Analysis = {
  probableConditions: Array<{ name: string; likelihood: 'low' | 'medium' | 'high'; rationale: string }>;
  nextSteps: { selfCare: string[]; whenToSeeDoctor: string[] };
  redFlags: string[];
  disclaimer: string;
};

class SymptomService {
  private getLocalizedText(language: string, key: string, fallback: string): string {
    // For now, return fallback text. In a real implementation, you might want to use i18n here
    // This is a simple approach for the fallback analysis
    if (language === 'hi') {
      const hindiTexts: Record<string, string> = {
        'viral_infection': 'वायरल संक्रमण',
        'bacterial_infection': 'बैक्टीरियल संक्रमण',
        'heat_exhaustion': 'गर्मी से थकान',
        'general_concern': 'सामान्य स्वास्थ्य चिंता',
        'rest': 'पर्याप्त आराम करें',
        'fluids': 'पर्याप्त तरल पदार्थ पिएं',
        'pain_relievers': 'दर्द निवारक दवाएं लें',
        'monitor_temp': 'तापमान की निगरानी करें',
        'seek_help': 'यदि लक्षण बिगड़ते हैं तो चिकित्सक से सलाह लें',
        'disclaimer': 'यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है और चिकित्सा सलाह का गठन नहीं करता है।'
      };
      return hindiTexts[key] || fallback;
    } else if (language === 'pa') {
      const punjabiTexts: Record<string, string> = {
        'viral_infection': 'ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ',
        'bacterial_infection': 'ਬੈਕਟੀਰੀਅਲ ਇਨਫੈਕਸ਼ਨ',
        'heat_exhaustion': 'ਗਰਮੀ ਤੋਂ ਥਕਾਵਟ',
        'general_concern': 'ਆਮ ਸਿਹਤ ਚਿੰਤਾ',
        'rest': 'ਪਰਿਆਪਤ ਆਰਾਮ ਕਰੋ',
        'fluids': 'ਪਰਿਆਪਤ ਤਰਲ ਪਦਾਰਥ ਪੀਓ',
        'pain_relievers': 'ਦਰਦ ਨਿਵਾਰਕ ਦਵਾਈਆਂ ਲਓ',
        'monitor_temp': 'ਤਾਪਮਾਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ',
        'seek_help': 'ਜੇ ਲੱਛਣ ਬਿਗੜਦੇ ਹਨ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ',
        'disclaimer': 'ਇਹ ਵਿਸ਼ਲੇਸ਼ਣ ਸਿਰਫ਼ ਸਿੱਖਿਆਤਮਕ ਉਦੇਸ਼ਾਂ ਲਈ ਹੈ ਅਤੇ ਮੈਡੀਕਲ ਸਲਾਹ ਦਾ ਗਠਨ ਨਹੀਂ ਕਰਦਾ।'
      };
      return punjabiTexts[key] || fallback;
    }
    return fallback;
  }

  async analyzeSymptoms(symptoms: string[], language: string = 'en'): Promise<Analysis> {
    try {
      console.log('🔍 Analyzing symptoms with Gemini AI:', symptoms, 'Language:', language);
      // Use the real Gemini AI service for analysis
      const analysis = await geminiService.generateSymptomAnalysis(symptoms, language);
      console.log('✅ Gemini AI analysis result:', analysis);
      return analysis;
    } catch (error: any) {
      console.error('❌ Gemini AI analysis error:', error);
      
      // Check if it's an API key error
      if (error.message?.includes('API key not valid') || error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API configuration.');
      }
      
      // Fallback to enhanced analysis if API fails for other reasons
      console.log('🔄 Falling back to enhanced analysis');
      return this.getEnhancedFallbackAnalysis(symptoms, language);
    }
  }

  private getEnhancedFallbackAnalysis(symptoms: string[], language: string = 'en'): Analysis {
    const lowerSymptoms = symptoms.map(s => s.toLowerCase());
    const has = (keyword: string) => lowerSymptoms.some(s => s.includes(keyword));
    
    const probableConditions: Array<{ name: string; likelihood: 'low' | 'medium' | 'high'; rationale: string }> = [];
    
    // Enhanced symptom pattern recognition
    if (has('fever') && has('cough')) {
      probableConditions.push({
        name: 'Viral respiratory infection (Cold/Flu)',
        likelihood: 'medium',
        rationale: 'Fever with cough commonly indicates a viral respiratory infection like cold or flu.'
      });
    }
    
    if (has('fever') && has('headache') && has('fatigue')) {
      probableConditions.push({
        name: 'Viral infection or flu-like illness',
        likelihood: 'medium',
        rationale: 'Combination of fever, headache, and fatigue often suggests a viral infection.'
      });
    }
    
    if (has('headache') && (has('light') || has('sound') || has('migraine'))) {
      probableConditions.push({
        name: 'Migraine or tension headache',
        likelihood: 'medium',
        rationale: 'Headache with sensitivity to light or sound suggests migraine pattern.'
      });
    }
    
    if (has('chest') && has('pain')) {
      probableConditions.push({
        name: 'Chest pain - requires medical evaluation',
        likelihood: 'high',
        rationale: 'Chest pain should be evaluated by a healthcare professional to rule out serious conditions.'
      });
    }
    
    if (has('stomach') || has('abdominal') || has('nausea') || has('vomit')) {
      probableConditions.push({
        name: 'Gastrointestinal issue',
        likelihood: 'low',
        rationale: 'Stomach symptoms could indicate various gastrointestinal conditions like gastritis or food poisoning.'
      });
    }
    
    if (has('fatigue') || has('tired') || has('weakness')) {
      probableConditions.push({
        name: 'General fatigue or exhaustion',
        likelihood: 'low',
        rationale: 'Fatigue can be associated with many conditions including stress, viral infections, or nutritional deficiencies.'
      });
    }
    
    if (has('cough') && has('shortness') || has('breathing')) {
      probableConditions.push({
        name: 'Respiratory condition',
        likelihood: 'medium',
        rationale: 'Cough with breathing difficulties may indicate a respiratory condition that needs attention.'
      });
    }
    
    if (has('joint') || has('muscle') || has('pain')) {
      probableConditions.push({
        name: 'Musculoskeletal pain',
        likelihood: 'low',
        rationale: 'Joint or muscle pain could be due to overuse, injury, or inflammatory conditions.'
      });
    }
    
    // Default if no specific patterns match
    if (probableConditions.length === 0) {
      probableConditions.push({
        name: this.getLocalizedText(language, 'general_concern', 'General health concern'),
        likelihood: 'low',
        rationale: this.getLocalizedText(language, 'seek_help', 'Your symptoms suggest a general health concern that should be monitored. Consider consulting a healthcare provider if symptoms persist or worsen.')
      });
    }

    return {
      probableConditions,
      nextSteps: {
        selfCare: [
          'Get adequate rest and sleep (7-9 hours)',
          'Stay hydrated with water and clear fluids',
          'Monitor your temperature if you have fever',
          'Use over-the-counter pain relief as needed (follow label instructions)',
          'Avoid strenuous activities until symptoms improve',
          'Eat light, nutritious meals',
          'Practice good hygiene to prevent spread of illness'
        ],
        whenToSeeDoctor: [
          'High fever (>38.5°C) lasting more than 3 days',
          'Difficulty breathing or shortness of breath',
          'Severe pain that doesn\'t improve with rest',
          'Symptoms worsen after 5-7 days',
          'Signs of dehydration (dry mouth, dizziness, infrequent urination)',
          'Any concerning or unusual symptoms',
          'Chest pain or pressure',
          'Severe headache with neck stiffness'
        ]
      },
      redFlags: [
        'Difficulty breathing or chest pain',
        'High fever with confusion or severe headache',
        'Signs of severe dehydration',
        'Severe abdominal pain',
        'Rash with fever',
        'Neck stiffness with fever',
        'Severe weakness or inability to move normally',
        'Blue lips or face',
        'Persistent vomiting',
        'Severe dizziness or fainting'
      ],
      disclaimer: this.getLocalizedText(language, 'disclaimer', 'This analysis is for educational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for proper diagnosis and treatment. In case of emergency, contact local emergency services immediately.')
    };
  }

}

export const symptomService = new SymptomService();
