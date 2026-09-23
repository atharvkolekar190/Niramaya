import { Tractor, Pill, Heart, Users, Clock, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function ImpactSection() {
  const impacts = [
    {
      icon: Tractor,
      title: "Economic Impact",
      description: "Daily-wage earners losing income due to healthcare travel",
      stat: "₹500-1000",
      statDesc: "Lost per medical visit",
      color: "orange"
    },
    {
      icon: Pill,
      title: "Medicine Scarcity",
      description: "Essential medicines frequently unavailable in rural pharmacies",
      stat: "40%",
      statDesc: "Medication shortage rate",
      color: "red"
    },
    {
      icon: Heart,
      title: "Health Outcomes",
      description: "Lack of specialists worsening chronic conditions",
      stat: "3x",
      statDesc: "Higher mortality rate",
      color: "blue"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          bg: 'bg-orange-100',
          icon: 'text-orange-600',
          stat: 'text-orange-600'
        };
      case 'red':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          stat: 'text-red-600'
        };
      case 'blue':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          stat: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          stat: 'text-gray-600'
        };
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
            Why This <span className="text-green-600">Matters</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The healthcare crisis extends beyond medical care, affecting livelihoods, 
            families, and the entire rural economy of Punjab.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impacts.map((impact, index) => {
            const colors = getColorClasses(impact.color);
            const IconComponent = impact.icon;
            
            return (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow">
                <div className={`${colors.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <IconComponent className={`h-8 w-8 ${colors.icon}`} />
                </div>
                
                <h3 className="text-xl mb-4 text-gray-900">{impact.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{impact.description}</p>
                
                <div className="border-t pt-4">
                  <div className={`text-2xl ${colors.stat} mb-1`}>{impact.stat}</div>
                  <div className="text-sm text-gray-500">{impact.statDesc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Human Stories */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl mb-8 text-center text-gray-900">Real Impact on Real Lives</h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1665250855519-25e3f817a96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBydXJhbCUyMGNvbW11bml0eSUyMGZhbWlseXxlbnwxfHx8fDE3NTc0NDE3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Rural Indian family"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-6">
              <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                "My daughter fell ill at night, but the nearest doctor was 35 km away. 
                By the time we reached the hospital, her condition had worsened significantly. 
                We lost two days of work and spent our entire monthly savings."
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">Harjeet Singh</div>
                  <div className="text-sm text-gray-600">Farmer, Village Shahzadpur</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-600">4 hours travel time</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">35 km distance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}