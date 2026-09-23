import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, MicOff, Brain, Sparkles, MessageCircle, Heart, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIHealthAssistantProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
}

export function AIHealthAssistant({ userRole, isOnline, emergencyMode }: AIHealthAssistantProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I'm HealthyAI, your virtual health assistant. I'm here to help you with medical questions, symptom analysis, medicine information, and health recommendations. How can I assist you today?`,
      timestamp: new Date(),
      sentiment: 'friendly',
      confidence: 95
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { 
      label: 'Check Symptoms', 
      icon: Activity, 
      query: 'I have some symptoms I\'d like to check',
      color: 'bg-blue-500'
    },
    { 
      label: 'Medicine Info', 
      icon: Heart, 
      query: 'Can you tell me about a medicine?',
      color: 'bg-green-500'
    },
    { 
      label: 'Health Tips', 
      icon: Sparkles, 
      query: 'Give me some daily health tips',
      color: 'bg-purple-500'
    },
    { 
      label: 'Emergency Help', 
      icon: Zap, 
      query: 'I need emergency medical guidance',
      color: 'bg-red-500'
    }
  ];

  const aiResponses = [
    {
      trigger: ['symptom', 'pain', 'fever', 'cough', 'headache'],
      response: `I understand you're experiencing symptoms. Based on what you've described, here are some initial recommendations:

🔍 **Immediate Assessment:**
- Monitor your temperature regularly
- Stay hydrated with plenty of fluids
- Get adequate rest

⚠️ **When to seek immediate care:**
- Difficulty breathing or chest pain
- High fever (>101.3°F/38.5°C)
- Severe or worsening symptoms

📋 **I recommend:**
1. Booking a consultation with a nearby doctor
2. Using our symptom checker for detailed analysis
3. Keeping a symptom diary

Would you like me to help you find the nearest available doctor or run a detailed symptom analysis?`,
      sentiment: 'caring',
      confidence: 88
    },
    {
      trigger: ['medicine', 'medication', 'drug', 'prescription'],
      response: `I can help you with medicine information! Here's what I can assist with:

💊 **Medicine Information:**
- Drug interactions and side effects
- Proper dosage and timing
- Storage requirements
- Generic alternatives

📍 **Local Availability:**
- Check nearby hub inventories
- Alternative medicine suggestions
- Prescription requirements

🔔 **Smart Reminders:**
- Set medication schedules
- Refill notifications
- Adherence tracking

What specific medicine would you like to know about? I can check our local hub inventory and provide detailed information.`,
      sentiment: 'helpful',
      confidence: 92
    },
    {
      trigger: ['health', 'tips', 'wellness', 'prevention'],
      response: `Here are personalized health tips based on your profile and local conditions:

🌟 **Daily Wellness:**
- Drink 8-10 glasses of water daily
- Take a 30-minute walk in fresh air
- Practice deep breathing exercises

🍎 **Nutrition Focus:**
- Include seasonal local fruits and vegetables
- Limit processed foods and sugar
- Maintain regular meal times

😴 **Rest & Recovery:**
- Aim for 7-9 hours of quality sleep
- Create a relaxing bedtime routine
- Limit screen time before bed

🏃 **Physical Activity:**
- Start with simple stretching exercises
- Use our community fitness challenges
- Track your progress with health analytics

Would you like me to create a personalized wellness plan for you?`,
      sentiment: 'encouraging',
      confidence: 90
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        sentiment: response.sentiment,
        confidence: response.confidence
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    for (const responseTemplate of aiResponses) {
      if (responseTemplate.trigger.some(trigger => lowerInput.includes(trigger))) {
        return {
          content: responseTemplate.response,
          sentiment: responseTemplate.sentiment,
          confidence: responseTemplate.confidence
        };
      }
    }

    // Default response
    return {
      content: `Thank you for your question! I'm analyzing your request and here's what I can help with:

🤖 **AI Analysis:** I'm processing your query using advanced health knowledge databases.

📋 **Recommendations:**
- I can provide general health information and guidance
- Connect you with local healthcare professionals
- Help you navigate our health hub network
- Offer personalized wellness suggestions

⚠️ **Important Note:** While I provide helpful information, please consult with healthcare professionals for medical decisions.

Could you provide more specific details about what you'd like to know? I'm here to help make your healthcare journey easier!`,
      sentiment: 'helpful',
      confidence: 85
    };
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputValue("I'd like to check my symptoms");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'caring': return 'text-blue-600';
      case 'helpful': return 'text-green-600';
      case 'encouraging': return 'text-purple-600';
      case 'friendly': return 'text-yellow-600';
      default: return 'text-primary';
    }
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
              <Bot className="h-8 w-8 text-purple-500" />
            </motion.div>
            AI Health Assistant
          </h1>
          <p className="text-muted-foreground">
            Your intelligent healthcare companion powered by advanced AI
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Confidence: 94%
          </Badge>
          <Badge variant={isOnline ? 'default' : 'secondary'}>
            {isOnline ? 'AI Online' : 'Offline Mode'}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI Assistant Interface */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1603056454645-7dbd815dc4e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwaGVhbHRoJTIwYXNzaXN0YW50JTIwcm9ib3R8ZW58MXx8fHwxNzU4ODA1MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">HealthyAI Assistant</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Active and ready to help
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </motion.div>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-4 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground ml-4' 
                        : 'bg-muted mr-4'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.type === 'ai' && message.confidence && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-muted-foreground/20">
                          <Badge variant="outline" className="text-xs">
                            {message.confidence}% Confidence
                          </Badge>
                          {message.sentiment && (
                            <Badge variant="outline" className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                              {message.sentiment}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Avatar className={`${message.type === 'user' ? 'order-1' : 'order-2'} w-8 h-8`}>
                    {message.type === 'user' ? (
                      <AvatarFallback>{userRole?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about your health..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  variant={isListening ? 'destructive' : 'outline'}
                  size="icon"
                  onClick={toggleVoiceInput}
                  disabled={!isOnline}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-muted-foreground flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                  Listening... Speak now
                </motion.div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common health queries to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col gap-2 relative group overflow-hidden"
                        onClick={() => handleQuickAction(action.query)}
                      >
                        <div className={`p-2 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{action.label}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Sidebar */}
        <div className="space-y-6">
          {/* AI Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Processing Power</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-sm">94%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <Badge variant="outline">~1.2s</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Knowledge Base</span>
                <Badge variant="outline">Updated Daily</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Health Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Health Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Seasonal Alert</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Flu season approaching. Consider vaccination and preventive measures.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Wellness Tip</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Your activity level is great! Keep maintaining regular exercise.
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">Local Health</h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  3 new health hubs opened in your area this month.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Continuous Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFsdGhjYXJlJTIwdGVjaG5vbG9neSUyMEFJfGVufDF8fHx8MTc1ODgwNTIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="AI Healthcare Technology"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                <div className="absolute bottom-2 left-2 text-white text-sm">
                  AI-Powered Healthcare
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interactions Today</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Learning Updates</span>
                  <span className="font-medium">Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy Rate</span>
                  <span className="font-medium text-green-600">97.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}