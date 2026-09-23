import { Users, MapPin, Clock, Stethoscope } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
              The Healthcare Crisis in Rural <span className="text-green-600">Punjab</span>
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Nabha's rural communities face unprecedented healthcare challenges. With a severe shortage of medical professionals, 
              inadequate infrastructure, and geographical barriers, thousands of residents struggle to access basic medical care.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="mb-2 text-gray-900">Critical Staff Shortage</h4>
                  <p className="text-gray-600">Only 11 doctors available against 23 sanctioned positions</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="mb-2 text-gray-900">Geographical Barriers</h4>
                  <p className="text-gray-600">Patients traveling 30+ km to reach nearest healthcare facility</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="mb-2 text-gray-900">Time-Critical Delays</h4>
                  <p className="text-gray-600">Emergency cases often delayed due to distance and poor connectivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Infographic */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl mb-8 text-center text-gray-900">Healthcare Access Crisis</h3>
            
            <div className="space-y-8">
              {/* Doctor Availability */}
              <div className="text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="flex gap-1">
                    {[...Array(23)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-8 rounded ${
                          i < 11 ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="text-green-600">11</span> working doctors out of <span className="text-gray-900">23</span> sanctioned
                </p>
              </div>

              {/* Village Coverage */}
              <div className="text-center">
                <div className="grid grid-cols-10 gap-1 mb-4">
                  {[...Array(100)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded ${
                        i < 31 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Only <span className="text-blue-600">31%</span> households have internet access
                </p>
              </div>

              {/* Population Impact */}
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <div className="text-3xl text-red-600 mb-2">50,000+</div>
                <p className="text-sm text-gray-700">Rural residents affected by limited healthcare access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}