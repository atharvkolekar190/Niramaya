import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBR1Lo49yCahy7QmanJsI4cl_-9KjsZbsY';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicineSuggestion {
  name: string;
  purpose: string;
  dosage: string;
  category: string;
  warnings?: string;
}

class GeminiService {
  // Use a current, supported Gemini model
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  private altModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async generateWithRetry(prompt: string): Promise<string> {
    const attempts = [
      async () => (await this.model.generateContent(prompt)).response.text(),
      async () => (await this.altModel.generateContent(prompt)).response.text(),
    ];
    let lastError: any = null;
    for (let i = 0; i < attempts.length; i++) {
      try {
        if (i > 0) {
          await this.sleep(500 + i * 500);
        }
        return await attempts[i]!();
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError;
  }

  private getHealthPrompt(): string {
    return `You are a helpful medical AI assistant. Your role is to provide general health information, symptom guidance, and wellness advice. 

IMPORTANT GUIDELINES:
- Always remind users that you are not a replacement for professional medical advice
- For serious symptoms, always recommend consulting a healthcare professional
- Provide general information only, not specific medical diagnoses
- Be empathetic and supportive in your responses
- Keep responses concise but informative
- If asked about specific medical conditions, provide general information and suggest professional consultation

You can help with:
- General health and wellness advice
- Understanding common symptoms
- Healthy lifestyle recommendations
- Basic first aid information
- When to seek medical attention
- General questions about health topics

Remember: Always encourage users to consult healthcare professionals for serious concerns.`;
  }

  private getLanguageInstructions(language: string): string {
    switch (language) {
      case 'hi':
        return `LANGUAGE INSTRUCTIONS: 
- Respond entirely in Hindi (हिंदी)
- Use Devanagari script
- Use medical terms that are commonly understood in Hindi
- For medical conditions, use both Hindi terms and English terms in parentheses where appropriate
- Example: "बुखार (Fever)" or "सिरदर्द (Headache)"`;
      
      case 'pa':
        return `LANGUAGE INSTRUCTIONS:
- Respond entirely in Punjabi (ਪੰਜਾਬੀ)  
- Use Gurmukhi script
- Use medical terms that are commonly understood in Punjabi
- For medical conditions, use both Punjabi terms and English terms in parentheses where appropriate
- Example: "ਬੁਖ਼ਾਰ (Fever)" or "ਸਿਰਦਰਦ (Headache)"`;
      
      default:
        return `LANGUAGE INSTRUCTIONS:
- Respond entirely in English
- Use clear, simple medical terminology
- Provide educational information that is easy to understand`;
    }
  }

  async generateResponse(
    userMessage: string,
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBR1Lo49yCahy7QmanJsI4cl_-9KjsZbsY';
      if (!apiKey) {
        return "I'm sorry, but the AI service is not configured. Please check with the administrator.";
      }

      // Build conversation context
      const conversationHistory = chatHistory
        .slice(-10) // Keep last 10 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const prompt = `${this.getHealthPrompt()}

Previous conversation:
${conversationHistory}

Current user message: ${userMessage}

Please provide a helpful response:`;

      const text = await this.generateWithRetry(prompt);
      return text;
    } catch (error) {
      console.error('Gemini AI error:', error);
      // Graceful offline guidance
      return [
        "I'm here to help with general guidance.",
        "- Try to rest, hydrate well, and monitor your symptoms.",
        "- If symptoms worsen, high fever persists, severe pain, breathing difficulty, chest pain, confusion, or dehydration occurs, seek medical care promptly.",
        "- This is educational, not a diagnosis.",
      ].join('\n');
    }
  }

  async generateHealthSummary(symptoms: string[]): Promise<string> {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBR1Lo49yCahy7QmanJsI4cl_-9KjsZbsY';
      if (!apiKey) {
        return "AI service not available for symptom analysis.";
      }

      const prompt = `${this.getHealthPrompt()}

The user has reported the following symptoms: ${symptoms.join(', ')}

Please provide:
1. A brief analysis of these symptoms
2. General guidance on what they might indicate
3. When they should seek medical attention
4. General self-care recommendations

Keep the response structured and easy to read.`;

      const text = await this.generateWithRetry(prompt);
      return text;
    } catch (error) {
      console.error('Gemini AI error:', error);
      return [
        "I'm unable to run AI analysis right now, but here's general guidance:",
        "- Consider rest, fluids, and over-the-counter symptom relief as appropriate.",
        "- Watch for red flags: high or persistent fever, chest pain, difficulty breathing, severe dehydration, confusion, or rapid worsening.",
        "- If any red flags are present, contact a healthcare professional or emergency services.",
      ].join('\n');
    }
  }

  async generateSymptomAnalysis(symptoms: string[], language: string = 'en'): Promise<{
    probableConditions: Array<{ name: string; likelihood: 'low' | 'medium' | 'high'; rationale: string }>;
    nextSteps: { selfCare: string[]; whenToSeeDoctor: string[] };
    redFlags: string[];
    disclaimer: string;
  }> {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBR1Lo49yCahy7QmanJsI4cl_-9KjsZbsY';
      console.log('🔑 Using API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'None');
      
      if (!apiKey) {
        console.log('❌ No API key found');
        return {
          probableConditions: [],
          nextSteps: { selfCare: [], whenToSeeDoctor: [] },
          redFlags: [],
          disclaimer: 'AI service not configured. This is not medical advice. Contact a clinician for concerns.'
        };
      }

      // Language-specific instructions
      const languageInstructions = this.getLanguageInstructions(language);
      
      const prompt = `${this.getHealthPrompt()}

${languageInstructions}

The user reports these symptoms: ${symptoms.join(', ')}

Return ONLY JSON matching this TypeScript type (no prose before/after):
{
  "probableConditions": Array<{ "name": string; "likelihood": "low" | "medium" | "high"; "rationale": string }>;
  "nextSteps": { "selfCare": string[]; "whenToSeeDoctor": string[] };
  "redFlags": string[];
  "disclaimer": string;
}

Rules:
- Keep to general, educational guidance only.
- Never provide diagnosis; use likelihood terms (low/medium/high).
- Include brief rationales tied to the symptoms.
- Always include a safety disclaimer.
- Respond in the requested language: ${language}
`;

      const text = (await this.generateWithRetry(prompt)).trim();
      console.log('🤖 Gemini API response:', text);

      // Attempt to extract JSON if the model wraps with code fences
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      console.log('📝 Extracted JSON:', jsonString);
      const parsed = JSON.parse(jsonString);
      console.log('✅ Parsed result:', parsed);

      // Basic shape validation
      return {
        probableConditions: Array.isArray(parsed.probableConditions) ? parsed.probableConditions : [],
        nextSteps: parsed.nextSteps && typeof parsed.nextSteps === 'object'
          ? {
              selfCare: Array.isArray(parsed.nextSteps.selfCare) ? parsed.nextSteps.selfCare : [],
              whenToSeeDoctor: Array.isArray(parsed.nextSteps.whenToSeeDoctor) ? parsed.nextSteps.whenToSeeDoctor : [],
            }
          : { selfCare: [], whenToSeeDoctor: [] },
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        disclaimer: typeof parsed.disclaimer === 'string' ? parsed.disclaimer : 'This information is educational and not a medical diagnosis. Seek professional care for concerns.'
      };
    } catch (error) {
      console.error('Gemini structured analysis error:', error);
      // Heuristic fallback based on simple keyword mapping
      const lower = symptoms.map(s => s.toLowerCase());
      const has = (k: string) => lower.some(s => s.includes(k));
      const probable: Array<{ name: string; likelihood: 'low' | 'medium' | 'high'; rationale: string }> = [];
      if (has('fever') && has('cough')) {
        probable.push({ name: 'Viral respiratory illness (e.g., cold/flu)', likelihood: 'medium', rationale: 'Fever with cough commonly suggests a viral respiratory infection.' });
      }
      if (has('headache') && has('light') || has('migraine')) {
        probable.push({ name: 'Migraine or primary headache', likelihood: 'low', rationale: 'Headache with light sensitivity suggests a migraine pattern.' });
      }
      if (has('chest') && has('pain')) {
        probable.push({ name: 'Chest pain — needs clinical evaluation', likelihood: 'low', rationale: 'Chest pain can be serious and warrants medical assessment.' });
      }
      const nextSteps = {
        selfCare: [
          'Rest and hydrate adequately.',
          'Use over-the-counter analgesics/antipyretics as appropriate (follow label instructions).',
          'Monitor temperature and symptom changes daily.'
        ],
        whenToSeeDoctor: [
          'High fever (>39°C) lasting >3 days or worsening.',
          'Shortness of breath, chest pain, confusion, severe dehydration.',
          'Symptoms rapidly worsening or not improving after several days.'
        ],
      };
      const redFlags = [
        'Difficulty breathing or blue lips/face',
        'Chest pain or pressure',
        'Confusion, fainting, or severe weakness',
        'Signs of severe dehydration (very infrequent urination, dizziness)',
      ];
      return {
        probableConditions: probable,
        nextSteps,
        redFlags,
        disclaimer: 'Educational information only, not a diagnosis. Seek professional care for concerns or red-flag symptoms.'
      };
    }
  }

  async generateMedicineSuggestions(symptoms: string[], language: string = 'en'): Promise<MedicineSuggestion[]> {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBR1Lo49yCahy7QmanJsI4cl_-9KjsZbsY';
      console.log('💊 Generating AI-powered medicine suggestions for symptoms:', symptoms);
      
      if (!apiKey) {
        console.log('❌ No API key found for medicine suggestions');
        return [];
      }

      const languageInstructions = this.getLanguageInstructions(language);
      
      const prompt = `${this.getHealthPrompt()}

${languageInstructions}

The user reports these symptoms: ${symptoms.join(', ')}

Based on these symptoms, suggest appropriate over-the-counter medicines that might help provide symptomatic relief. 

Return ONLY JSON array matching this TypeScript type (no prose before/after):
Array<{
  "name": string; // Generic medicine name (e.g., "Paracetamol", "Ibuprofen")
  "purpose": string; // What it's used for (e.g., "Pain relief and fever reducer")
  "dosage": string; // Standard adult dosage (e.g., "500-1000mg every 6-8 hours")
  "category": string; // Medicine category (e.g., "Antipyretic", "NSAID", "Antihistamine")
  "warnings"?: string; // Optional safety warnings
}>

IMPORTANT RULES:
- Only suggest common, over-the-counter medicines
- Provide generic names, not brand names
- Include appropriate dosage information for adults
- Add safety warnings where necessary
- Limit to 3-5 most relevant medicines
- Never suggest prescription medications
- Always emphasize consulting a doctor before taking any medication
- Respond in the requested language: ${language}

Example medicines to consider based on symptoms:
- Fever/Pain: Paracetamol, Ibuprofen
- Cough/Cold: Cetirizine, Loratadine
- Stomach issues: Omeprazole, Antacids
- General immune support: Vitamin C, Zinc supplements
`;

      const text = (await this.generateWithRetry(prompt)).trim();
      console.log('💊 Gemini medicine suggestions response:', text);

      // Attempt to extract JSON if the model wraps with code fences
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      console.log('📝 Extracted medicine JSON:', jsonString);
      const parsed = JSON.parse(jsonString);
      console.log('✅ Parsed medicine suggestions:', parsed);

      // Validate and return
      if (Array.isArray(parsed)) {
        return parsed.filter(med => 
          med && 
          typeof med.name === 'string' && 
          typeof med.purpose === 'string' &&
          typeof med.dosage === 'string' &&
          typeof med.category === 'string'
        );
      }
      
      return [];
    } catch (error) {
      console.error('❌ Gemini medicine suggestions error:', error);
      
      // Fallback to basic suggestions based on symptoms
      const lower = symptoms.map(s => s.toLowerCase());
      const has = (keyword: string) => lower.some(s => s.includes(keyword));
      const suggestions: MedicineSuggestion[] = [];

      if (has('fever') || has('temperature')) {
        suggestions.push({
          name: 'Paracetamol',
          purpose: 'Fever reducer and pain reliever',
          dosage: '500-1000mg every 6-8 hours (max 4g/day)',
          category: 'Antipyretic',
          warnings: 'Do not exceed recommended dose. Avoid alcohol.'
        });
      }

      if (has('pain') || has('headache') || has('ache')) {
        suggestions.push({
          name: 'Ibuprofen',
          purpose: 'Anti-inflammatory pain reliever',
          dosage: '200-400mg every 6-8 hours (max 1.2g/day)',
          category: 'NSAID',
          warnings: 'Take with food. Avoid if you have stomach ulcers.'
        });
      }

      if (has('cough') || has('cold') || has('congestion') || has('allergy')) {
        suggestions.push({
          name: 'Cetirizine',
          purpose: 'Antihistamine for allergy symptoms',
          dosage: '10mg once daily',
          category: 'Antihistamine',
          warnings: 'May cause drowsiness. Avoid alcohol.'
        });
      }

      if (has('stomach') || has('nausea') || has('acid') || has('heartburn')) {
        suggestions.push({
          name: 'Omeprazole',
          purpose: 'Proton pump inhibitor for acid reflux',
          dosage: '20mg once daily before meals',
          category: 'PPI',
          warnings: 'Take 30-60 minutes before eating.'
        });
      }

      if (has('fatigue') || has('weakness') || has('tired') || suggestions.length === 0) {
        suggestions.push({
          name: 'Vitamin C',
          purpose: 'Immune system support and antioxidant',
          dosage: '500-1000mg daily',
          category: 'Vitamin Supplement',
          warnings: 'High doses may cause stomach upset.'
        });
      }

      return suggestions.slice(0, 5); // Limit to 5 suggestions
    }
  }
}

export const geminiService = new GeminiService();