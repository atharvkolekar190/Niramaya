import { useState, useEffect } from 'react';
import { ArrowLeft, Brain, MessageSquare, AlertTriangle, User, Plus, X, ArrowRight, Pill, MapPin, ExternalLink, ShoppingCart, Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { symptomService, type Analysis } from '../services/symptomService';
import { geminiService, type MedicineSuggestion } from '../lib/gemini';
import { medicineService, type MedicineInfo } from '../services/medicineService';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface AISymptomCheckerProps {
  onBack: () => void;
}

interface EnhancedMedicineSuggestion extends MedicineSuggestion {
  info?: MedicineInfo;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AISymptomChecker({ onBack }: AISymptomCheckerProps) {
  const { t, i18n } = useTranslation();
  
  // Fallback function for translations
  const translate = (key: string, fallback?: string) => {
    const translation = t(key);
    return translation === key ? (fallback || key) : translation;
  };
  
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [suggestedMedicines, setSuggestedMedicines] = useState<EnhancedMedicineSuggestion[]>([]);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Voice input states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Hardcoded common symptoms for village people (in multiple languages)
  const commonSymptoms = {
    en: [
      'Fever', 'Cough', 'Headache', 'Stomach pain', 'Body ache', 'Cold', 'Sore throat',
      'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Chest pain', 'Shortness of breath',
      'Dizziness', 'Fatigue', 'Joint pain', 'Back pain', 'Skin rash', 'Itching', 'Burning sensation',
      'Loss of appetite', 'Weight loss', 'Insomnia', 'Anxiety', 'Depression', 'Memory problems'
    ],
    hi: [
      'बुखार', 'खांसी', 'सिरदर्द', 'पेट दर्द', 'शरीर दर्द', 'जुकाम', 'गले में दर्द',
      'मतली', 'उल्टी', 'दस्त', 'कब्ज', 'छाती में दर्द', 'सांस लेने में तकलीफ',
      'चक्कर आना', 'थकान', 'जोड़ों में दर्द', 'कमर दर्द', 'त्वचा पर चकत्ते', 'खुजली', 'जलन',
      'भूख न लगना', 'वजन कम होना', 'नींद न आना', 'चिंता', 'अवसाद', 'याददाश्त की समस्या'
    ],
    pa: [
      'ਤਾਪ', 'ਖੰਘ', 'ਸਿਰ ਦਰਦ', 'ਪੇਟ ਦਰਦ', 'ਸਰੀਰ ਦਰਦ', 'ਜ਼ੁਕਾਮ', 'ਗਲੇ ਵਿੱਚ ਦਰਦ',
      'ਮਤਲੀ', 'ਉਲਟੀ', 'ਦਸਤ', 'ਕਬਜ਼', 'ਛਾਤੀ ਦਰਦ', 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ',
      'ਚਕਰ ਆਉਣਾ', 'ਥਕਾਵਟ', 'ਜੋੜਾਂ ਦਰਦ', 'ਕਮਰ ਦਰਦ', 'ਚਮੜੀ \'ਤੇ ਚਕਤੇ', 'ਖੁਜਲੀ', 'ਜਲਣ',
      'ਭੁੱਖ ਨਾ ਲੱਗਣਾ', 'ਵਜ਼ਨ ਘਟਣਾ', 'ਨੀਂਦ ਨਾ ਆਉਣਾ', 'ਚਿੰਤਾ', 'ਉਦਾਸੀ', 'ਯਾਦਦਾਸ਼ਤ ਦੀ ਸਮਸਿਆ'
    ]
  };

  // Check for speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const addSymptom = () => {
    const value = symptomInput.trim();
    if (!value) return;
    if (symptoms.includes(value.toLowerCase())) {
      setSymptomInput('');
      return;
    }
    setSymptoms(prev => [...prev, value.toLowerCase()]);
    setSymptomInput('');
  };

  const addSymptomFromList = (symptom: string) => {
    if (symptoms.includes(symptom.toLowerCase())) {
      return;
    }
    setSymptoms(prev => [...prev, symptom.toLowerCase()]);
  };

  const removeSymptom = (s: string) => {
    setSymptoms(prev => prev.filter(x => x !== s));
  };

  const startVoiceInput = () => {
    if (!speechSupported) {
      setError('Voice input is not supported in your browser. Please use text input instead.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = i18n.language === 'pa' ? 'pa-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US';

    setIsListening(true);
    setError(null);

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input:', transcript);
      setSymptomInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Voice input error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const runAnalysis = async () => {
    if (loading) return;
    if (symptoms.length === 0) {
      setError(t('symptomChecker.symptomInput.addSymptomError'));
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSuggestedMedicines([]);
    
    try {
      // Use the real symptom service with Gemini AI, passing current language
      const analysisResult = await symptomService.analyzeSymptoms(symptoms, i18n.language);
      setAnalysis(analysisResult);
      
      // Get AI-powered medicine suggestions from Gemini
      console.log('🤖 Fetching AI-powered medicine suggestions...');
      const aiMedicines = await geminiService.generateMedicineSuggestions(symptoms, i18n.language);
      console.log('💊 AI medicine suggestions received:', aiMedicines);
      setSuggestedMedicines(aiMedicines);
      
      // Load additional medicine information from the medicine service
      if (aiMedicines.length > 0) {
        setMedicineLoading(true);
        try {
          const enhancedMedicines = await Promise.all(
            aiMedicines.map(async (medicine) => {
              try {
                const info = await medicineService.getMedicineInfo(medicine.name);
                return { ...medicine, info };
              } catch (error) {
                console.error(`Failed to load info for ${medicine.name}:`, error);
                return medicine;
              }
            })
          );
          setSuggestedMedicines(enhancedMedicines);
        } catch (error) {
          console.error('Failed to load medicine information:', error);
        } finally {
          setMedicineLoading(false);
        }
      }
    } catch (e: any) {
      console.error('Symptom analysis error:', e);
      setError(t('symptomChecker.symptomInput.analysisError'));
    } finally {
      setLoading(false);
    }
  };

  const likelihoodColor = (l: 'low' | 'medium' | 'high') => {
    switch (l) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const handleCheckMedicineAvailability = (medicineName: string) => {
    // Navigate to Medicine Availability Tracker with pre-searched medicine
    console.log(`🔍 Redirecting to Medicine Availability Tracker for: ${medicineName}`);
    
    // Check current port and redirect accordingly
    const currentPort = window.location.port;
    let medicineTrackerUrl;
    
    if (currentPort === '3000' || currentPort === '3001') {
      // If on main healthcare website (port 3000 or 3001), go to medicine-tracker page
      medicineTrackerUrl = `/medicine-tracker?search=${encodeURIComponent(medicineName)}`;
      window.location.href = medicineTrackerUrl;
    } else {
      // If on different port, open in new tab on port 3001 (current port)
      medicineTrackerUrl = `http://localhost:3001/medicine-tracker?search=${encodeURIComponent(medicineName)}`;
      window.open(medicineTrackerUrl, '_blank');
    }
  };

  const handleViewAllMedicines = () => {
    // Navigate to Medicine Availability Tracker main page
    console.log('🏥 Redirecting to Medicine Availability Tracker main page');
    
    const currentPort = window.location.port;
    let medicineTrackerUrl;
    
    if (currentPort === '3000' || currentPort === '3001') {
      // If on main healthcare website (port 3000 or 3001), go to medicine-tracker page
      medicineTrackerUrl = '/medicine-tracker';
      window.location.href = medicineTrackerUrl;
    } else {
      // If on different port, open in new tab on port 3001 (current port)
      medicineTrackerUrl = 'http://localhost:3001/medicine-tracker';
      window.open(medicineTrackerUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {translate('symptomChecker.backToHomepage', 'Back to Homepage')}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl text-gray-900">{translate('symptomChecker.title', 'AI-Powered Symptom Checker')}</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            {translate('symptomChecker.hero.title', 'Smart Health Assessment')} 
            <span className="text-purple-600"> {translate('symptomChecker.hero.subtitle', 'Powered by AI')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translate('symptomChecker.hero.description', 'Get instant preliminary health assessments based on your symptoms. Our AI helps you understand when to seek medical care and provides initial guidance in multiple languages.')}
          </p>
        </div>

        {!analysis ? (
          <>
            {/* Symptom Input */}
            <Card className="mb-8 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <MessageSquare className="h-5 w-5" />
                  {translate('symptomChecker.symptomInput.title', 'Tell us about your symptoms')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Symptom Input with Voice */}
                  <div className="flex items-center space-x-2">
                    <input
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSymptom();
                        }
                      }}
                      placeholder={translate('symptomChecker.symptomInput.placeholder', 'Add a symptom (e.g., fever, cough, fatigue)')}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <Button
                      onClick={addSymptom}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {speechSupported && (
                      <Button
                        onClick={startVoiceInput}
                        disabled={isListening}
                        className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        title="Click to speak your symptoms"
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Voice Input Status */}
                  {isListening && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Listening... Speak your symptoms now</span>
                    </div>
                  )}

                  {/* Common Symptoms Quick Add */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      {translate('symptomChecker.commonSymptoms.title', 'Common Symptoms - Click to Add')}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {commonSymptoms[i18n.language as keyof typeof commonSymptoms]?.map((symptom, index) => (
                        <Button
                          key={index}
                          onClick={() => addSymptomFromList(symptom)}
                          variant="outline"
                          size="sm"
                          className="text-xs hover:bg-purple-50 hover:border-purple-300"
                        >
                          {symptom}
                        </Button>
                      )) || commonSymptoms.en.map((symptom, index) => (
                        <Button
                          key={index}
                          onClick={() => addSymptomFromList(symptom)}
                          variant="outline"
                          size="sm"
                          className="text-xs hover:bg-purple-50 hover:border-purple-300"
                        >
                          {symptom}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Symptoms */}
                  {symptoms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {translate('symptomChecker.symptomInput.selectedSymptoms', 'Selected symptoms')}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {symptoms.map((symptom) => (
                          <Badge
                            key={symptom}
                            className="bg-purple-100 text-purple-800 px-3 py-1 flex items-center gap-2"
                          >
                            {symptom}
                            <button
                              onClick={() => removeSymptom(symptom)}
                              className="hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analyze Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={runAnalysis}
                      disabled={symptoms.length === 0 || loading}
                      className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {translate('symptomChecker.symptomInput.analyzing', 'Analyzing...')}
                        </>
                      ) : (
                        <>
                          {translate('symptomChecker.symptomInput.analyzeButton', 'Analyze Symptoms')}
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Results Section */}
            <Card className="mb-8 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="h-5 w-5" />
                  {translate('symptomChecker.results.title', 'AI Assessment Results')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Probable Conditions */}
                  <div className="lg:col-span-2">
                    <h4 className="text-gray-900 mb-3 font-medium">{translate('symptomChecker.results.probableConditions', 'Probable Conditions')}</h4>
                    <div className="space-y-3">
                      {analysis.probableConditions.length === 0 ? (
                        <p className="text-gray-600 text-sm">{translate('symptomChecker.results.noConditions', 'No conditions suggested. Try adding more specific symptoms.')}</p>
                      ) : (
                        analysis.probableConditions.map((condition, index) => (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-gray-900 font-medium">{condition.name}</h5>
                              <Badge className={`text-xs ${likelihoodColor(condition.likelihood)}`}>
                                {translate(`symptomChecker.results.likelihood.${condition.likelihood}`, 
                                  condition.likelihood === 'high' ? 'high likelihood' :
                                  condition.likelihood === 'medium' ? 'medium likelihood' : 'low likelihood'
                                )}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm">{condition.rationale}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h4 className="text-gray-900 mb-3 font-medium">{translate('symptomChecker.results.nextSteps.title', 'Next Steps')}</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-gray-800 font-medium mb-2">{translate('symptomChecker.results.nextSteps.selfCare', 'Self-care')}</h5>
                        <ul className="space-y-1">
                          {analysis.nextSteps.selfCare.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-gray-800 font-medium mb-2">{translate('symptomChecker.results.nextSteps.whenToSeeDoctor', 'When to see a doctor')}</h5>
                        <ul className="space-y-1">
                          {analysis.nextSteps.whenToSeeDoctor.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {analysis.redFlags.length > 0 && (
                        <div>
                          <h5 className="text-red-800 font-medium mb-2">{translate('symptomChecker.results.nextSteps.redFlags', 'Red flags')}</h5>
                          <ul className="space-y-1">
                            {analysis.redFlags.map((flag, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Medicine Suggestions Section */}
            {suggestedMedicines.length > 0 && (
              <Card className="mb-8 border-green-200 bg-green-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Pill className="h-5 w-5" />
                    {translate('symptomChecker.medicines.title', 'AI-Suggested Medicines')}
                  </CardTitle>
                  <p className="text-sm text-green-600">
                    {translate('symptomChecker.medicines.subtitle', 'Based on your symptoms, our AI suggests these medicines that might help. Always consult a doctor before taking any medication.')}
                  </p>
                  {medicineLoading && (
                    <div className="flex items-center gap-2 text-green-600 mt-2">
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Loading medicine information...</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedMedicines.map((medicine, index) => (
                      <div key={index} className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-green-600" />
                            <h5 className="text-gray-900 font-medium">{medicine.name}</h5>
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {medicine.category}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{medicine.purpose}</p>
                        
                        <p className="text-gray-500 text-xs mb-3">
                          <strong>Dosage:</strong> {medicine.dosage}
                        </p>
                        
                        {medicine.warnings && (
                          <div className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded">
                            <strong>⚠️ Warning:</strong> {medicine.warnings}
                          </div>
                        )}
                        
                        {medicine.info && medicine.info.warnings && (
                          <div className="text-xs text-gray-500 mb-3">
                            <strong>Additional Info:</strong> {medicine.info.warnings}
                          </div>
                        )}
                        
                        <Button
                          onClick={() => handleCheckMedicineAvailability(medicine.name)}
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Check Availability
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Medicine Tracker Button */}
                  <div className="mt-6 text-center">
                    <Button
                      onClick={handleViewAllMedicines}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Medicine Availability Tracker
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Over */}
            <div className="flex justify-center items-center py-8">
              <Button
                onClick={() => {
                  setAnalysis(null);
                  setSymptoms([]);
                  setSuggestedMedicines([]);
                  setError(null);
                }}
                variant="outline"
                size="lg"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 text-base font-medium"
              >
                {translate('symptomChecker.actions.checkDifferentSymptoms', 'Check Different Symptoms')}
              </Button>
            </div>
          </>
        )}

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{translate('symptomChecker.features.aiPowered.title', 'AI-Powered')}</h3>
              <p className="text-gray-600 text-sm">{translate('symptomChecker.features.aiPowered.description', 'Advanced Gemini AI algorithms')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-indigo-200 bg-indigo-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{translate('symptomChecker.features.multilingual.title', 'Multilingual')}</h3>
              <p className="text-gray-600 text-sm">{translate('symptomChecker.features.multilingual.description', 'Available in Punjabi, Hindi & English')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{translate('symptomChecker.features.medicineSuggestions.title', 'AI Medicine Suggestions')}</h3>
              <p className="text-gray-600 text-sm">{translate('symptomChecker.features.medicineSuggestions.description', 'Gemini AI-powered medicine recommendations')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{translate('symptomChecker.features.emergencyDetection.title', 'Emergency Detection')}</h3>
              <p className="text-gray-600 text-sm">{translate('symptomChecker.features.emergencyDetection.description', 'Identifies urgent medical situations')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Important Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="text-yellow-800 mb-2">{translate('symptomChecker.disclaimer.title', 'Important Medical Disclaimer')}</h4>
                <p className="text-yellow-700 text-sm">
                  {analysis?.disclaimer || translate('symptomChecker.disclaimer.text', 'This AI symptom checker is for informational purposes only and does not constitute medical advice. It cannot replace professional medical consultation. Always consult with qualified healthcare providers for proper diagnosis and treatment. In case of emergency, contact local emergency services immediately.')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 mt-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">500+</div>
                <p className="text-purple-100">{translate('symptomChecker.stats.symptomsAnalyzed', 'Symptom Checks Completed')}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">95%</div>
                <p className="text-purple-100">{translate('symptomChecker.stats.accuracyRate', 'AI Accuracy Rate')}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">200+</div>
                <p className="text-purple-100">{translate('symptomChecker.stats.medicalConditions', 'Conditions Covered')}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">24/7</div>
                <p className="text-purple-100">{translate('symptomChecker.stats.availableSupport', 'AI Available')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}