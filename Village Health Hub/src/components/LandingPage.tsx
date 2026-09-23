import React from 'react';
import { Heart, MapPin, Users, Shield, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect volunteers, patients, and healthcare providers in one platform'
    },
    {
      icon: MapPin,
      title: 'Location-Based',
      description: 'Find the nearest health hub and available services in your area'
    },
    {
      icon: Clock,
      title: 'Quick Access',
      description: 'Reduce travel time to distant hospitals with local health hubs'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified volunteers and healthcare providers for community trust'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-xl font-semibold">Village Health Hub</span>
          </div>
          <Button onClick={onGetStarted}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Healthcare Access for <span className="text-blue-600">Remote Villages</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect your community with essential healthcare services. Volunteers offer spaces for medicine storage 
            and doctor consultations, bringing healthcare closer to home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-3">
              Join the Network
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1742106850780-fbcc50b1ef5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwcnVyYWwlMjBoZWFsdGhjYXJlJTIwY2xpbmljfGVufDF8fHx8MTc1ODgwNDMzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Rural healthcare clinic"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform creates a network of community health hubs, making healthcare accessible to everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're offering help or seeking care, there's a place for you in our network.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle>Volunteer Hosts</CardTitle>
                <CardDescription>Offer your space for medicine storage and consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Share available space in your home</li>
                  <li>• Store medicines safely for the community</li>
                  <li>• Host doctor visits and consultations</li>
                  <li>• Build trust and help neighbors</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle>Patients</CardTitle>
                <CardDescription>Access healthcare services in your village</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Find medicines at nearby hubs</li>
                  <li>• Book consultations with doctors</li>
                  <li>• Reduce travel to distant hospitals</li>
                  <li>• Get emergency medical assistance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle>Healthcare Providers</CardTitle>
                <CardDescription>Extend your reach to rural communities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Schedule visits to village hubs</li>
                  <li>• Manage medicine distribution</li>
                  <li>• Conduct telemedicine sessions</li>
                  <li>• Track patient care remotely</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Village Hubs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2hrs</div>
              <div className="text-lg opacity-90">Average Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of community members who are improving healthcare access in rural areas.
          </p>
          <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-3">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-lg font-semibold">Village Health Hub</span>
          </div>
          <p className="text-muted-foreground">
            Bringing healthcare closer to rural communities, one village at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}