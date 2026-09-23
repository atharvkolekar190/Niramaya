import React, { useState } from 'react';
import { Search, Brain, AlertTriangle, CheckCircle, Heart, Thermometer, User, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface SymptomCheckerProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
}

export function SymptomChecker({ userRole, isOnline, emergencyMode }: SymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    medications: '',
    allergies: ''
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const commonSymptoms = [
    { id: 'fever', label: 'Fever', category: 'general', severity: 'medium', icon: Thermometer },
    { id: 'headache', label: 'Headache', category: 'neurological', severity: 'low', icon: Brain },
    { id: 'cough', label: 'Cough', category: 'respiratory', severity: 'medium', icon: Heart },
    { id: 'sore-throat', label: 'Sore Throat', category: 'respiratory', severity: 'low', icon: Heart },
    { id: 'fatigue', label: 'Fatigue', category: 'general', severity: 'low', icon: User },
    { id: 'nausea', label: 'Nausea', category: 'digestive', severity: 'medium', icon: Heart },
    { id: 'chest-pain', label: 'Chest Pain', category: 'cardiac', severity: 'high', icon: Heart },
    { id: 'shortness-breath', label: 'Shortness of Breath', category: 'respiratory', severity: 'high', icon: Heart },
    { id: 'dizziness', label: 'Dizziness', category: 'neurological', severity: 'medium', icon: Brain },
    { id: 'abdominal-pain', label: 'Abdominal Pain', category: 'digestive', severity: 'medium', icon: Heart },
    { id: 'rash', label: 'Skin Rash', category: 'dermatological', severity: 'low', icon: User },
    { id: 'joint-pain', label: 'Joint Pain', category: 'musculoskeletal', severity: 'medium', icon: User }
  ];

  const bodyParts = [
    { id: 'head', label: 'Head', x: 50, y: 15 },
    { id: 'chest', label: 'Chest', x: 50, y: 35 },
    { id: 'abdomen', label: 'Abdomen', x: 50, y: 50 },
    { id: 'arms', label: 'Arms', x: 25, y: 40 },
    { id: 'legs', label: 'Legs', x: 50, y: 75 }
  ];

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-950';
      case 'medium': return 'text-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-950';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    // Simulate AI analysis
    const hasHighSeverity = selectedSymptoms.some(id => 
      commonSymptoms.find(s => s.id === id)?.severity === 'high'
    );

    const result = {
      riskLevel: hasHighSeverity ? 'high' : selectedSymptoms.length > 3 ? 'medium' : 'low',
      confidence: Math.floor(Math.random() * 20) + 80,
      possibleConditions: hasHighSeverity 
        ? ['Cardiac Event', 'Respiratory Emergency', 'Acute Condition']
        : ['Common Cold', 'Viral Infection', 'Stress-related symptoms'],
      recommendations: hasHighSeverity
        ? ['Seek immediate medical attention', 'Call emergency services', 'Go to nearest hospital']
        : ['Rest and monitor symptoms', 'Stay hydrated', 'Consider over-the-counter medication'],
      nextSteps: hasHighSeverity
        ? 'Emergency consultation recommended'
        : 'Schedule routine consultation if symptoms persist'
    };

    setAnalysisResult(result);
    setCurrentStep(4);
  };

  const resetChecker = () => {
    setCurrentStep(1);
    setSelectedSymptoms([]);
    setSearchQuery('');
    setPatientInfo({
      age: '',
      gender: '',
      weight: '',
      height: '',
      medications: '',
      allergies: ''
    });
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Heart className="h-8 w-8 text-pink-500" />
            </motion.div>
            AI Symptom Checker
          </h1>
          <p className="text-muted-foreground">
            AI-powered health assessment to help understand your symptoms
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Powered
          </Badge>
          {currentStep > 1 && (
            <Button variant="outline" onClick={resetChecker}>
              Start Over
            </Button>
          )}
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Symptom Assessment Progress</h3>
            <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Symptoms</span>
            <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Duration</span>
            <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Patient Info</span>
            <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Analysis</span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Warning */}
      {emergencyMode && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Emergency Mode Active:</strong> If you're experiencing severe symptoms, call emergency services immediately (108) or visit the nearest hospital.
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Symptom Selection */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search Symptoms</TabsTrigger>
              <TabsTrigger value="body">Body Map</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What symptoms are you experiencing?</CardTitle>
                  <CardDescription>
                    Search and select all symptoms you're currently experiencing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search symptoms (e.g., headache, fever, cough)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredSymptoms.map((symptom) => {
                      const Icon = symptom.icon;
                      const isSelected = selectedSymptoms.includes(symptom.id);
                      return (
                        <motion.div
                          key={symptom.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleSymptomToggle(symptom.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                checked={isSelected}
                                onChange={() => {}}
                              />
                              <Icon className={`h-5 w-5 ${getSeverityColor(symptom.severity).split(' ')[0]}`} />
                              <div className="flex-1">
                                <h4 className="font-medium">{symptom.label}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className={`text-xs ${getSeverityColor(symptom.severity)}`}>
                                    {symptom.severity}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{symptom.category}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {selectedSymptoms.length > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Selected Symptoms ({selectedSymptoms.length}):</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map(id => {
                          const symptom = commonSymptoms.find(s => s.id === id);
                          return (
                            <Badge key={id} variant="secondary" className="flex items-center gap-1">
                              {symptom?.label}
                              <button
                                onClick={() => handleSymptomToggle(id)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="body" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Body Map</CardTitle>
                  <CardDescription>Click on the body part where you're experiencing symptoms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="relative w-64 h-96 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full">
                      {bodyParts.map((part) => (
                        <motion.button
                          key={part.id}
                          className="absolute w-8 h-8 bg-primary rounded-full hover:scale-125 transition-transform"
                          style={{ 
                            left: `${part.x}%`, 
                            top: `${part.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => console.log(`Clicked ${part.label}`)}
                        >
                          <span className="sr-only">{part.label}</span>
                        </motion.button>
                      ))}
                      
                      {/* Body outline */}
                      <div className="absolute inset-4 border-2 border-primary/20 rounded-full" />
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-primary/20 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {bodyParts.map((part) => (
                      <Button
                        key={part.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => console.log(`Selected ${part.label}`)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {part.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['general', 'respiratory', 'cardiac', 'neurological', 'digestive', 'musculoskeletal'].map((category) => (
                  <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="capitalize">{category}</CardTitle>
                      <CardDescription>
                        {commonSymptoms.filter(s => s.category === category).length} symptoms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {commonSymptoms
                          .filter(s => s.category === category)
                          .slice(0, 3)
                          .map(symptom => (
                            <div key={symptom.id} className="text-sm text-muted-foreground">
                              • {symptom.label}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {selectedSymptoms.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} size="lg">
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Step 2: Duration and Severity */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Symptom Details</CardTitle>
              <CardDescription>Help us understand more about your symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedSymptoms.map(id => {
                const symptom = commonSymptoms.find(s => s.id === id);
                return (
                  <div key={id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-4">{symptom?.label}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Duration</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="How long?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hours">A few hours</SelectItem>
                            <SelectItem value="1day">1 day</SelectItem>
                            <SelectItem value="2-3days">2-3 days</SelectItem>
                            <SelectItem value="week">About a week</SelectItem>
                            <SelectItem value="longer">Longer than a week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Severity (1-10)</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Rate severity" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(10)].map((_, i) => (
                              <SelectItem key={i} value={(i + 1).toString()}>
                                {i + 1} - {i < 3 ? 'Mild' : i < 7 ? 'Moderate' : 'Severe'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Patient Information */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>This information helps provide more accurate analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age</label>
                  <Input
                    type="number"
                    placeholder="Enter age"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <Select
                    value={patientInfo.gender}
                    onValueChange={(value) => setPatientInfo(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="Enter weight"
                    value={patientInfo.weight}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Height (cm)</label>
                  <Input
                    type="number"
                    placeholder="Enter height"
                    value={patientInfo.height}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Current Medications</label>
                <Input
                  placeholder="List any medications you're currently taking"
                  value={patientInfo.medications}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, medications: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Known Allergies</label>
                <Input
                  placeholder="List any known allergies"
                  value={patientInfo.allergies}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, allergies: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={analyzeSymptoms}>
                  Analyze Symptoms
                  <Brain className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Analysis Results */}
      {currentStep === 4 && analysisResult && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className={`border-2 ${
            analysisResult.riskLevel === 'high' ? 'border-red-500' :
            analysisResult.riskLevel === 'medium' ? 'border-orange-500' :
            'border-green-500'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  AI Analysis Results
                </CardTitle>
                <Badge 
                  variant={analysisResult.riskLevel === 'high' ? 'destructive' : 'outline'}
                  className={`text-sm ${
                    analysisResult.riskLevel === 'high' ? '' :
                    analysisResult.riskLevel === 'medium' ? 'border-orange-500 text-orange-600' :
                    'border-green-500 text-green-600'
                  }`}
                >
                  {analysisResult.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <CardDescription>
                Based on {selectedSymptoms.length} symptoms and patient information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">AI Confidence Level</span>
                <div className="flex items-center gap-2">
                  <Progress value={analysisResult.confidence} className="w-24 h-2" />
                  <span className="font-semibold">{analysisResult.confidence}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Possible Conditions</h4>
                  <div className="space-y-2">
                    {analysisResult.possibleConditions.map((condition: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 border rounded">
                        <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {analysisResult.riskLevel === 'high' && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Urgent:</strong> Your symptoms indicate a potentially serious condition. 
                    Please seek immediate medical attention or call emergency services (108).
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Next Steps</h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200">{analysisResult.nextSteps}</p>
                  
                  <div className="flex gap-4 mt-4">
                    {analysisResult.riskLevel === 'high' ? (
                      <Button variant="destructive" size="lg">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Emergency (108)
                      </Button>
                    ) : (
                      <Button size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Consultation
                      </Button>
                    )}
                    
                    <Button variant="outline" size="lg">
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Nearest Hub
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetChecker}>
                  Start New Assessment
                </Button>
                <Button variant="outline">
                  Save Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Medical Disclaimer:</strong> This AI symptom checker is for informational purposes only 
              and should not replace professional medical advice, diagnosis, or treatment. Always consult 
              with qualified healthcare professionals for medical concerns.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}