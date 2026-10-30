import { Video, FileText, Pill, Building2, Stethoscope, BookOpen, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface FeaturesSectionProps {
  onFeatureClick: (feature: string) => void;
  userRole?: 'patient' | 'doctor' | 'pharmacist' | null;
}

// All available features
const allFeatures = [
  {
    id: 'health-resources',
    title: 'Wellness Library',
    description: 'Learn about prevention, nutrition, hygiene, sleep, movement, and everyday wellbeing',
    icon: BookOpen,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    hoverColor: 'hover:bg-emerald-100'
  },
  {
    id: 'telemedicine',
    title: 'Multilingual Telemedicine App',
    description: 'Connect with healthcare providers through video consultations in Marathi, Hindi, and English',
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
    id: 'pharmacy',
    title: 'Pharmacy Dashboard',
    description: 'Real-time inventory management for pharmacies to update medicine stock and availability',
    icon: Building2,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100'
  }
];

// Additional bullet points merged from the former "Our Solution" section
const featureBullets: Record<string, string[]> = {
  'telemedicine': ['HD Video Calls', 'Multi-language Support', 'Role-based Dashboards', 'Secure Consultations'],
  'records': ['Patient Records', 'Medical History', 'Secure Storage', 'Data Management'],
  'medicine': ['Real-time Stock', '173 Village Coverage', 'Pharmacy Network', 'Verified Data']
};

// Role-specific features with custom descriptions
const patientFeatures = [
  {
    id: 'telemedicine',
    title: 'Multilingual Telemedicine App',
    description: 'Connect with healthcare providers through video consultations in Marathi, Hindi, and English',
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
      id: 'health-resources',
      title: 'Wellness Library',
      description: 'Explore practical information about prevention, nutrition, wellness, and everyday health',
      icon: BookOpen,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      hoverColor: 'hover:bg-emerald-100'
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
    description: 'Conduct video consultations with patients in Marathi, Hindi, and English',
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
  }
];

const pharmacistFeatures = [
  {
    id: 'pharmacy',
    title: 'Pharmacy Dashboard',
    description: 'Prescription-based medicine fulfillment and patient order coordination',
    icon: Building2,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100'
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
    <section id="solutions" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <p className="niramaya-kicker mb-3">One connected care platform</p>
          <h2 className="niramaya-section-title mb-4">
            Comprehensive Healthcare <span className="text-green-600">Solutions</span>
          </h2>
          <p className="text-lg leading-relaxed text-slate-600">
            {userRole ?
              `Explore ${userRole}-specific tools designed for your healthcare needs` :
              'Explore Niramaya tools for connected, accessible digital healthcare'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`group cursor-pointer rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.45)] ${feature.borderColor} ${feature.hoverColor}`}
                onClick={() => onFeatureClick(feature.id)}
              >
                <CardContent className="h-full p-7 md:p-8">
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg shadow-slate-900/10 transition-transform duration-300 group-hover:scale-105`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="mb-3 text-xl font-semibold text-slate-900 transition-colors group-hover:text-emerald-800">
                        {feature.title}
                      </h3>
                      <p className="mb-5 leading-relaxed text-slate-600">
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
                      <span className="text-sm font-medium text-slate-500 group-hover:text-emerald-700 transition-colors">
                        Click to explore
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
              Healthcare information, connected care, and trusted support
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Niramaya brings patients, doctors, pharmacists, records, consultations, prescriptions, and health education together in one ecosystem.
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