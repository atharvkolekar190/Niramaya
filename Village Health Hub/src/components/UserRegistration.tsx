import React, { useState } from 'react';
import { ArrowLeft, Users, Heart, Shield, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

type UserRole = 'volunteer' | 'patient' | 'doctor';

interface UserRegistrationProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

export function UserRegistration({ onLogin, onBack }: UserRegistrationProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    spaceSize: '',
    facilities: [] as string[],
    availability: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const userTypes = [
    {
      id: 'volunteer' as UserRole,
      title: 'Volunteer Host',
      description: 'Offer space for medicine storage and consultations',
      icon: Users,
      color: 'green'
    },
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      description: 'Access healthcare services in your area',
      icon: Heart,
      color: 'blue'
    },
    {
      id: 'doctor' as UserRole,
      title: 'Healthcare Provider',
      description: 'Provide medical services to rural communities',
      icon: Shield,
      color: 'purple'
    }
  ];

  const facilities = [
    'Refrigerator for vaccines',
    'First aid kit',
    'Storage shelves',
    'Separate room',
    'Basic furniture',
    'Internet connection',
    'Generator backup'
  ];

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: checked 
        ? [...prev.facilities, facility]
        : prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Join Village Health Hub</h1>
                <p className="text-muted-foreground">Choose how you'd like to participate in our community</p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="grid md:grid-cols-3 gap-6">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedRole(type.id)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        type.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                        type.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                        'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          type.color === 'green' ? 'text-green-600' :
                          type.color === 'blue' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Select This Role
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => setSelectedRole(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {selectedRole === 'volunteer' && 'Volunteer Host Registration'}
                {selectedRole === 'patient' && 'Patient Registration'}
                {selectedRole === 'doctor' && 'Healthcare Provider Registration'}
              </h1>
              <p className="text-muted-foreground">Complete your profile to get started</p>
            </div>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Village/Location *</Label>
                    <Input
                      id="location"
                      placeholder="Enter your village name"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>

                {/* Doctor-specific fields */}
                {selectedRole === 'doctor' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization *</Label>
                        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Practice</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="gynecology">Gynecology</SelectItem>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="dentistry">Dentistry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license">Medical License Number *</Label>
                        <Input
                          id="license"
                          placeholder="Enter license number"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Volunteer-specific fields */}
                {selectedRole === 'volunteer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="spaceSize">Available Space Size</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, spaceSize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select space size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (10-20 medicines)</SelectItem>
                          <SelectItem value="medium">Medium (20-50 medicines)</SelectItem>
                          <SelectItem value="large">Large (50+ medicines)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Available Facilities</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {facilities.map((facility) => (
                          <div key={facility} className="flex items-center space-x-2">
                            <Checkbox
                              id={facility}
                              checked={formData.facilities.includes(facility)}
                              onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                            />
                            <Label htmlFor={facility} className="text-sm">{facility}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability Schedule</Label>
                      <Textarea
                        id="availability"
                        placeholder="Describe when you're available (e.g., Weekdays 9 AM - 5 PM)"
                        value={formData.availability}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                {/* Patient-specific fields */}
                {selectedRole === 'patient' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Emergency contact number"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                      <Textarea
                        id="medicalHistory"
                        placeholder="Any relevant medical conditions or allergies"
                        value={formData.medicalHistory}
                        onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}