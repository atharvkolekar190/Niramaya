import { Video, FileText, Pill, Brain, Building2, Stethoscope, MessageCircle, HeartPulse, Droplets } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface FeaturesSectionProps {
  onFeatureClick: (feature: string) => void;
  userRole?: 'patient' | 'doctor' | 'pharmacist' | null;
}

// All available features
const allFeatures = [
  {
    id: 'telemedicine',
    title: 'Multilingual Telemedicine App',
    description: 'Connect with healthcare providers through video consultations in Punjabi, Hindi, and English',
    icon: Video,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:bg-green-100'
  },
  {
    id: 'records',
    title: 'Digital Health Records',
    description: 'Secure, accessible, and comprehensive digital health records that follow you everywhere',
    icon: FileText,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    id: 'symptom-checker',
    title: 'AI Symptom Checker',
    description: 'AI-powered symptom analysis to help patients understand their health concerns and get preliminary guidance',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    id: 'medicine',
    title: 'Medicine Availability Tracker',
    description: 'Track medicine availability across nearby pharmacies and plan pickups',
    icon: Pill,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    hoverColor: 'hover:bg-orange-100'
  },
  {
    id: 'community',
    title: 'Community Chat & Support',
    description: 'Connect with patients, doctors, and healthcare providers in real-time community discussions',
    icon: MessageCircle,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy Dashboard',
    description: 'Real-time inventory management for pharmacies to update medicine stock and availability',
    icon: Building2,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100'
  }
  ,
  {
    id: 'village-hub',
    title: 'Village Health Hub',
    description: 'One-stop hub for local healthcare services, scheduling, and AI assistant',
    icon: HeartPulse,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    hoverColor: 'hover:bg-rose-100'
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy & Period Tracker',
    description: 'Track cycles, pregnancy journey, and personalized tips',
    icon: Droplets,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    hoverColor: 'hover:bg-pink-100'
  },
  {
    id: 'blood-donation',
    title: 'Blood Donation',
    description: 'Find donors, manage requests, chat, and safety guidance',
    icon: Droplets,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    hoverColor: 'hover:bg-red-100'
  }
];

// Additional bullet points merged from the former "Our Solution" section
const featureBullets: Record<string, string[]> = {
  'telemedicine': ['HD Video Calls', 'Multi-language Support', 'Role-based Dashboards', 'Emergency SOS'],
  'records': ['Patient Records', 'Medical History', 'Secure Storage', 'Data Management'],
  'medicine': ['Real-time Stock', '173 Village Coverage', 'Pharmacy Network', 'Verified Data'],
  'symptom-checker': ['Multi-language Support', 'Symptom Analysis', 'Health Guidance', 'Safety Disclaimers']
};

// Role-specific features with custom descriptions
const patientFeatures = [
  {
    id: 'telemedicine',
    title: 'Multilingual Telemedicine App',
    description: 'Connect with healthcare providers through video consultations in Punjabi, Hindi, and English',
    icon: Video,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:bg-green-100'
  },
  {
    id: 'records',
    title: 'Digital Health Records',
    description: 'Secure, accessible, and comprehensive digital health records that follow you everywhere',
    icon: FileText,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    id: 'symptom-checker',
    title: 'AI Symptom Checker',
    description: 'AI-powered symptom analysis to help patients understand their health concerns and get preliminary guidance',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    id: 'medicine',
    title: 'Medicine Availability Tracker',
    description: 'Find medicines in stock at pharmacies near you',
    icon: Pill,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    hoverColor: 'hover:bg-orange-100'
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy & Period Tracker',
    description: 'Track cycles and pregnancy journey with personalized tips',
    icon: Droplets,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    hoverColor: 'hover:bg-pink-100'
  },
  {
    id: 'blood-donation',
    title: 'Blood Donation',
    description: 'Find donors, manage requests, and follow safety guidance',
    icon: Droplets,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    hoverColor: 'hover:bg-red-100'
  }
];

const doctorFeatures = [
  {
    id: 'doctor-dashboard',
    title: 'Doctor Dashboard',
    description: 'Comprehensive dashboard to manage patients and access their health records',
    icon: Stethoscope,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    id: 'telemedicine',
    title: 'Multilingual Telemedicine App',
    description: 'Conduct video consultations with patients in Punjabi, Hindi, and English',
    icon: Video,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:bg-green-100'
  },
  {
    id: 'medicine',
    title: 'Medicine Availability Tracker',
    description: 'Check medicine availability and guide patients to nearby pharmacies',
    icon: Pill,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    hoverColor: 'hover:bg-orange-100'
  },
  {
    id: 'symptom',
    title: 'AI-Powered Symptom Checker',
    description: 'Use AI assistance for preliminary diagnosis and treatment recommendations',
    icon: Brain,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100'
  }
];

const pharmacistFeatures = [
  {
    id: 'pharmacy',
    title: 'Pharmacy Dashboard',
    description: 'Real-time inventory management for pharmacies to update medicine stock and availability',
    icon: Building2,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100'
  },
  {
    id: 'symptom-checker',
    title: 'AI Symptom Checker',
    description: 'AI-powered symptom analysis to help patients understand their health concerns and get preliminary guidance',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    id: 'telemedicine',
    title: 'Multilingual Telemedicine App',
    description: 'Connect with doctors and patients for prescription consultations',
    icon: Video,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:bg-green-100'
  },
  {
    id: 'records',
    title: 'Digital Health Records',
    description: 'Access patient medication history and prescription records',
    icon: FileText,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:bg-blue-100'
  }
];

export default function FeaturesSection({ onFeatureClick, userRole }: FeaturesSectionProps) {
  console.log('FeaturesSection: Received userRole:', userRole);

  // Get features based on user role
  const getFeaturesForRole = () => {
    console.log('FeaturesSection: Getting features for role:', userRole);
    switch (userRole) {
      case 'patient':
        console.log('FeaturesSection: Returning patient features');
        return patientFeatures;
      case 'doctor':
        console.log('FeaturesSection: Returning doctor features');
        return doctorFeatures;
      case 'pharmacist':
        console.log('FeaturesSection: Returning pharmacist features');
        return pharmacistFeatures;
      default:
        console.log('FeaturesSection: Returning all features (default)');
        return allFeatures;
    }
  };

  const features = getFeaturesForRole();
  console.log('FeaturesSection: Final features array:', features.map(f => f.id));

  return (
    <section id="solutions" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">
            Comprehensive Healthcare <span className="text-green-600">Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {userRole ?
              `Explore ${userRole}-specific tools designed for your healthcare needs` :
              'Explore our complete suite of telemedicine tools designed specifically for rural healthcare challenges in Punjab'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${feature.borderColor} ${feature.hoverColor} group`}
                onClick={() => onFeatureClick(feature.id)}
              >
                <CardContent className="p-8 h-full">
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      {featureBullets[feature.id] ? (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {featureBullets[feature.id].map((b, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                              <span className="text-sm text-gray-700">{b}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                        Click to explore
                      </span>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl mb-4">
              Ready to Transform Rural Healthcare?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join our mission to bring quality healthcare to every village in Punjab.
              These tools are designed to bridge the gap between rural patients and healthcare providers.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => onFeatureClick('telemedicine')}
                className="bg-white text-green-600 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}