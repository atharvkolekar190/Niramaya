import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BloodDropIcon } from './BloodDropIcon';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Shield, AlertTriangle, CheckCircle, Heart, Clock, User } from 'lucide-react';

export function SafetyGuidelines() {
  const eligibilityCriteria = [
    { icon: <User className="h-5 w-5" />, title: 'Age', requirement: '18-65 years old', eligible: true },
    { icon: <Heart className="h-5 w-5" />, title: 'Weight', requirement: 'Minimum 50kg (110 lbs)', eligible: true },
    { icon: <Shield className="h-5 w-5" />, title: 'Health', requirement: 'Good general health', eligible: true },
    { icon: <Clock className="h-5 w-5" />, title: 'Frequency', requirement: 'Every 8 weeks minimum', eligible: true },
  ];

  const beforeDonation = [
    'Get a good night\'s sleep (7-9 hours)',
    'Eat a healthy meal within 4 hours',
    'Drink plenty of water (16-20 oz extra)',
    'Avoid alcohol for 24 hours prior',
    'Wear clothing with sleeves that can be rolled up',
    'Bring a valid photo ID',
    'List any medications you\'re taking'
  ];

  const afterDonation = [
    'Rest for 15 minutes before leaving',
    'Keep the bandage on for 4-6 hours',
    'Drink extra fluids for the next 24 hours',
    'Avoid heavy lifting for 24 hours',
    'Eat iron-rich foods (spinach, red meat, beans)',
    'Take it easy if you feel lightheaded',
    'Contact us if you experience any problems'
  ];

  const contraindications = [
    { condition: 'Recent tattoo or piercing', timeframe: 'Wait 4 months' },
    { condition: 'Cold or flu symptoms', timeframe: 'Wait until fully recovered' },
    { condition: 'Recent travel to malaria areas', timeframe: 'Wait 1-3 years' },
    { condition: 'Recent dental work', timeframe: 'Wait 24 hours' },
    { condition: 'Recent vaccination', timeframe: 'Wait 2-4 weeks' },
    { condition: 'Pregnancy or recent pregnancy', timeframe: 'Wait 6 weeks after delivery' }
  ];

  const emergencyContacts = [
    { type: 'Emergency Helpline', number: '1-800-BLOOD-HELP', available: '24/7' },
    { type: 'Medical Support', number: '1-800-MED-SUPPORT', available: 'Business hours' },
    { type: 'Donor Services', number: '1-800-DONOR-CARE', available: '24/7' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1615461066159-fea0960485d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYmxvb2QlMjBkb25hdGlvbiUyMGhvc3BpdGFsfGVufDF8fHx8MTc1ODgwNjA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Blood donation safety"
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary mb-2">Blood Donation Safety Guidelines</h1>
              <p className="text-muted-foreground mb-4">
                Your safety is our top priority. Please review these guidelines to ensure a safe donation experience.
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  WHO Approved
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Medically Reviewed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Eligibility Criteria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {eligibilityCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="text-primary">{criteria.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{criteria.title}</p>
                  <p className="text-sm text-muted-foreground">{criteria.requirement}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ))}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <BloodDropIcon className="text-primary mt-1" size={16} />
                <div>
                  <p className="font-medium text-sm">Additional Requirements</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You must wait at least 8 weeks between whole blood donations and feel well on donation day.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temporary Deferrals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Temporary Deferrals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contraindications.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.condition}</p>
                  <p className="text-xs text-muted-foreground">Common temporary restriction</p>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  {item.timeframe}
                </Badge>
              </div>
            ))}
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-orange-600 mt-1" size={16} />
                <div>
                  <p className="font-medium text-sm">Important Note</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These are temporary restrictions for your safety and the safety of blood recipients. You can donate once the deferral period ends.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Donation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Before Your Donation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {beforeDonation.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1602021727639-deddded5dc69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjcm9zcyUyMGhlYWx0aGNhcmUlMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1ODgwNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Healthy preparation"
                className="w-full h-24 rounded object-cover mb-3"
              />
              <p className="font-medium text-sm">Pro Tip</p>
              <p className="text-xs text-muted-foreground mt-1">
                A balanced meal with iron-rich foods 2-3 hours before donation helps maintain your energy levels.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After Donation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>After Your Donation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {afterDonation.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-red-600 mt-1" size={16} />
                <div>
                  <p className="font-medium text-sm">When to Seek Help</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact us immediately if you experience persistent dizziness, nausea, or unusual bleeding at the donation site.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BloodDropIcon className="text-primary" size={20} />
                </div>
                <h4 className="font-medium">{contact.type}</h4>
                <p className="text-lg font-bold text-primary mt-1">{contact.number}</p>
                <Badge variant="outline" className="mt-2">
                  {contact.available}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="text-blue-600 mt-1" size={16} />
              <div>
                <p className="font-medium text-sm">24/7 Support</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Our medical team is available around the clock to address any concerns you may have before, during, or after your donation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}