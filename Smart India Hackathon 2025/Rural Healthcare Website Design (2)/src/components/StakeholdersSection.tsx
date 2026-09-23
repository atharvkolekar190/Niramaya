import { Users, UserCheck, Building, Pill, Tractor, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { memo } from 'react';

type Props = { compact?: boolean };

function StakeholdersSection({ compact = false }: Props) {
  const stakeholders = [
    {
      icon: Users,
      title: "Rural Patients & Families",
      description: "Primary beneficiaries gaining access to quality healthcare without travel barriers",
      benefits: ["Reduced travel costs", "Faster consultations", "Better health outcomes", "24/7 emergency support"],
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      count: "50,000+ People"
    },
    {
      icon: UserCheck,
      title: "Nabha Civil Hospital Staff",
      description: "Healthcare professionals extending their reach through digital consultations",
      benefits: ["Increased patient reach", "Better resource utilization", "Digital health records", "Reduced workload"],
      color: "blue",
      gradient: "from-blue-500 to-cyan-600",
      count: "11 Active Doctors"
    },
    {
      icon: Building,
      title: "Punjab Health Department",
      description: "Government stakeholders implementing scalable rural healthcare solutions",
      benefits: ["Policy implementation", "Resource optimization", "Data-driven insights", "Scalable model"],
      color: "purple",
      gradient: "from-purple-500 to-violet-600",
      count: "State Level"
    },
    {
      icon: Pill,
      title: "Local Pharmacies",
      description: "Pharmacy networks integrated for medicine availability and delivery",
      benefits: ["Inventory management", "Prescription integration", "Delivery coordination", "Revenue increase"],
      color: "orange",
      gradient: "from-orange-500 to-amber-600",
      count: "12 Pharmacies"
    },
    {
      icon: Tractor,
      title: "Farmers & Daily Workers",
      description: "Agricultural workforce maintaining productivity while accessing healthcare",
      benefits: ["No work day loss", "Preventive care access", "Family health management", "Cost savings"],
      color: "yellow",
      gradient: "from-yellow-500 to-amber-500",
      count: "80% of Population"
    },
    {
      icon: Heart,
      title: "Community Health Workers",
      description: "ASHAs and ANMs empowered with digital tools for better patient care",
      benefits: ["Digital training", "Patient monitoring tools", "Emergency protocols", "Performance tracking"],
      color: "red",
      gradient: "from-red-500 to-rose-600",
      count: "200+ Workers"
    }
  ];

  return (
    <section className={`${compact ? 'pt-6 pb-20' : 'py-20'} bg-gray-50`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
            Key <span className="text-green-600">Stakeholders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our telemedicine solution brings together diverse stakeholders, 
            creating a comprehensive healthcare ecosystem that benefits everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stakeholders.map((stakeholder, index) => {
            const IconComponent = stakeholder.icon;
            
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stakeholder.gradient}`}></div>
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stakeholder.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{stakeholder.title}</CardTitle>
                  <div className={`text-sm text-${stakeholder.color}-600 opacity-80`}>{stakeholder.count}</div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{stakeholder.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wide">Key Benefits</h4>
                    <ul className="space-y-1">
                      {stakeholder.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stakeholder.gradient}`}></div>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Collaboration Network */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl mb-8 text-center text-gray-900">Collaborative Healthcare Ecosystem</h3>
          
          <div className="relative">
            {/* Central Hub */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-900">Telemedicine Platform</div>
                <div className="text-sm text-gray-600">Central Coordination Hub</div>
              </div>
            </div>

            {/* Connection Lines and Stakeholder Circles */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
              {stakeholders.slice(0, 6).map((stakeholder, index) => {
                const IconComponent = stakeholder.icon;
                const angle = (index * 60) * (Math.PI / 180); // 60 degrees apart
                
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stakeholder.gradient} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-900">{stakeholder.title.split(' ')[0]} {stakeholder.title.split(' ')[1]}</div>
                    <div className="text-xs text-gray-600">{stakeholder.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg mb-4 text-center text-gray-900">Impact Multiplier Effect</h4>
            <p className="text-center text-gray-700 leading-relaxed">
              When all stakeholders work together, the impact is multiplied. Better healthcare access leads to 
              improved productivity, stronger communities, and sustainable economic growth across rural Punjab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(StakeholdersSection);