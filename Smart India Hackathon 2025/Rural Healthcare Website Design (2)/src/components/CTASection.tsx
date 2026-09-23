import { ArrowRight, Globe, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CTASectionProps {
  onJoinCommunity?: () => void;
  onOpenVillageHub?: () => void;
}

export default function CTASection({ onJoinCommunity, onOpenVillageHub }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-green-200 uppercase tracking-wide text-sm">Community Initiative</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl mb-6 leading-tight">
              Community Health for <span className="text-green-200">Rural India</span>
            </h2>
            
            <p className="text-xl mb-8 leading-relaxed text-green-100">
              Built with and for communities: local volunteers, health workers, and families.
              Join a grassroots effort to make primary healthcare accessible, trusted, and
              multilingual—right where people live.
            </p>

            {/* Impact Numbers */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2 text-yellow-300">2,500</div>
                <div className="text-sm text-green-200">Rural Population Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2 text-yellow-300">1:200</div>
                <div className="text-sm text-green-200">Doctor-Patient Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2 text-yellow-300">85%</div>
                <div className="text-sm text-green-200">Access Improvement</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 text-lg"
                onClick={() => {
                  if (onJoinCommunity) {
                    onJoinCommunity();
                  } else {
                    console.warn('CTASection: onJoinCommunity handler not provided');
                  }
                }}
              >
                <Users className="mr-2 h-5 w-5" />
                Join the Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 px-8 py-3 text-lg"
                onClick={() => {
                  if (onOpenVillageHub) {
                    onOpenVillageHub();
                  } else {
                    console.warn('CTASection: onOpenVillageHub handler not provided');
                  }
                }}
              >
                <Globe className="mr-2 h-5 w-5" />
                Open Village Health Hub
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1606618871497-d848be8dc159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVjaG5vbG9neSUyMHRlbGVtZWRpY2luZXxlbnwxfHx8fDE3NTc0MTEwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthcare technology and telemedicine"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <h3 className="text-xl mb-4 text-white">Community-Ready</h3>
              <ul className="space-y-3 text-green-100">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Proven, simple-to-use tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Works with local clinics and ASHA workers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Multi-language support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Offline-first, low-bandwidth friendly</span>
                </li>
              </ul>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-yellow-300 text-green-800 p-4 rounded-full shadow-lg">
              <Globe className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-green-700 p-4 rounded-full shadow-lg">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-12 border-t border-white/20">
          <div className="text-center">
            <h3 className="text-2xl mb-6 text-white">Join the Community</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg mb-2 text-white">Community Leaders</h4>
                <p className="text-green-200 text-sm">Mobilize volunteers and local support</p>
              </div>
              
              <div>
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg mb-2 text-white">Local Clinics</h4>
                <p className="text-green-200 text-sm">Deliver care with community reach</p>
              </div>
              
              <div>
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg mb-2 text-white">Volunteers & NGOs</h4>
                <p className="text-green-200 text-sm">Coordinate drives and outreach</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}