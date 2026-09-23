import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, Wifi, Heart } from 'lucide-react';
import { memo } from 'react';

function DataSection() {
  const doctorData = [
    { category: 'Sanctioned', count: 23, color: '#e5e7eb' },
    { category: 'Working', count: 11, color: '#22c55e' },
    { category: 'Vacant', count: 12, color: '#ef4444' }
  ];

  const internetData = [
    { category: 'Connected', value: 31, color: '#3b82f6' },
    { category: 'Not Connected', value: 69, color: '#e5e7eb' }
  ];

  const telemedicineGrowthData = [
    { year: '2019', growth: 12 },
    { year: '2020', growth: 28 },
    { year: '2021', growth: 45 },
    { year: '2022', growth: 67 },
    { year: '2023', growth: 89 },
    { year: '2024', growth: 118 },
    { year: '2025*', growth: 155 }
  ];

  const healthOutcomesData = [
    { metric: 'Consultation Wait Time', current: 120, projected: 15 },
    { metric: 'Travel Distance (km)', current: 35, projected: 0 },
    { metric: 'Treatment Delay (hours)', current: 8, projected: 0.5 },
    { metric: 'Healthcare Access (%)', current: 45, projected: 95 }
  ];

  const COLORS = {
    primary: '#22c55e',
    secondary: '#3b82f6',
    accent: '#f97316',
    danger: '#ef4444',
    muted: '#e5e7eb'
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
            Data-Driven <span className="text-green-600">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive analysis of rural healthcare challenges and the projected 
            impact of our telemedicine solution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Doctor Availability Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Doctor Availability Crisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={doctorData}>
                  <CartesianGrid strokeDasharray="3,3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">
                Only <span className="text-green-600">11 out of 23</span> sanctioned doctor positions are filled, 
                creating a 52% shortage in medical staff.
              </p>
            </CardContent>
          </Card>

          {/* Internet Penetration - Simplified */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-blue-600" />
                Internet Connectivity in Rural Punjab
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl text-blue-600 mb-2">31%</div>
                  <div className="text-sm text-gray-600">Households Connected</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Connected</span>
                    <span className="text-blue-600">31%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Not Connected</span>
                    <span className="text-gray-600">69%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-400 h-3 rounded-full" style={{ width: '69%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Telemedicine Growth Trend - Simplified */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Telemedicine Growth in India
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl text-green-600 mb-2">31%</div>
                <div className="text-sm text-gray-600">Annual Growth Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-green-600 mb-2">₹155</div>
                <div className="text-sm text-gray-600">Market Size (2025)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-green-600 mb-2">5x</div>
                <div className="text-sm text-gray-600">Growth Since 2019</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-6 text-center">
              The telemedicine market in India is growing at a <span className="text-green-600">31% CAGR</span>, 
              with rural healthcare being a major growth driver.
            </p>
          </CardContent>
        </Card>

        {/* Health Outcomes Comparison */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Expected Health Outcomes Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {healthOutcomesData.map((outcome, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="text-sm text-gray-900">{outcome.metric}</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Current</span>
                      <span className="text-sm text-red-600">{outcome.current}{outcome.metric.includes('%') ? '%' : outcome.metric.includes('km') ? ' km' : outcome.metric.includes('hours') ? ' hrs' : ' min'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(outcome.current, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">With Telemedicine</span>
                      <span className="text-sm text-green-600">{outcome.projected}{outcome.metric.includes('%') ? '%' : outcome.metric.includes('km') ? ' km' : outcome.metric.includes('hours') ? ' hrs' : ' min'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(outcome.projected, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl text-green-600 mb-2">95%</div>
            <div className="text-sm text-gray-700">Projected Healthcare Access</div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl text-blue-600 mb-2">80%</div>
            <div className="text-sm text-gray-700">Reduction in Travel Time</div>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <div className="text-3xl text-orange-600 mb-2">₹500</div>
            <div className="text-sm text-gray-700">Average Savings per Visit</div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <div className="text-3xl text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-gray-700">Healthcare Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(DataSection);