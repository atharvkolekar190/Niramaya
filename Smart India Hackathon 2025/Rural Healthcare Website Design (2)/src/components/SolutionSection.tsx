import { Smartphone, Database, Pill, Bot, Video, FileText, Wifi, Users } from 'lucide-react';
import { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function SolutionSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const solutions = [
    {
      icon: Video,
      title: "Multilingual Telemedicine App",
      description: "TeleHealth-powered video consultations supporting Punjabi, Hindi, and English with role-based access",
      features: ["HD Video Calls", "Multi-language Support", "Role-based Dashboards", "Emergency SOS"],
      color: "green",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Comprehensive patient records system with secure data management and accessibility",
      features: ["Patient Records", "Medical History", "Secure Storage", "Data Management"],
      color: "blue",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Pill,
      title: "Medicine Availability Tracker",
      description: "Real-time medicine tracking across 173 villages with verified data and pharmacy network",
      features: ["Real-time Stock", "173 Village Coverage", "Pharmacy Network", "Verified Data"],
      color: "orange",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      icon: Bot,
      title: "AI-Powered Symptom Checker",
      description: "AI-powered symptom analysis with multilingual support and intelligent health guidance",
      features: ["Multi-language Support", "Symptom Analysis", "Health Guidance", "Safety Disclaimers"],
      color: "purple",
      gradient: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
            Our <span className="text-green-600">Solution</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive healthcare platform with real-time medicine tracking, AI-powered symptom analysis, 
            multilingual support, and role-based dashboards for patients, doctors, and pharmacists.
          </p>
        </div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            
            return (
              <Card 
                key={index}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  hoveredCard === index ? 'ring-2 ring-green-500' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-5`}></div>
                
                <CardHeader className="relative">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{solution.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="relative">
                  <p className="text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${solution.gradient}`}></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technology Infrastructure */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl mb-8 text-center text-gray-900">Powered by Advanced Technology</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg mb-3 text-gray-900">Real-time API Integration</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                OpenFDA API integration for accurate medicine data and real-time pharmacy inventory tracking
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg mb-3 text-gray-900">AI-Powered Analysis</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gemini AI integration for intelligent symptom analysis with multilingual support in Punjabi, Hindi, and English
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-lg mb-3 text-gray-900">Role-Based Access</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tailored dashboards for patients, doctors, and pharmacists with role-specific features and permissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(SolutionSection);