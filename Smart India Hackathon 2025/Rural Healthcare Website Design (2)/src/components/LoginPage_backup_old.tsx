import { useState, useEffect } from 'react';
import { Eye, EyeOff, Heart, Smartphone, Shield, AlertCircle, CheckCircle, User, Mail, Lock, Phone, MapPin, Stethoscope, Pill, Building2, GraduationCap, FileText, ArrowRight, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { authService, type LoginCredentials, type PatientRegistrationData, type DoctorRegistrationData, type PharmacistRegistrationData } from '../services/authService';

interface LoginPageProps {
  onLogin: (userRole: 'patient' | 'doctor' | 'pharmacist') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'pharmacist' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    specialization: '',
    hospital: '',
    contact: '',
    license_number: '',
    pharmacy_name: ''
  });

  // Animation states
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 3, text: 'Good', color: 'bg-blue-500' };
    return { strength: 4, text: 'Strong', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    console.log('Login attempt with credentials:');
    console.log('Email:', formData.email);
    console.log('Password:', formData.password);
    console.log('UserType:', selectedRole);
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        if (!selectedRole || (selectedRole !== 'patient' && selectedRole !== 'doctor' && selectedRole !== 'pharmacist')) {
          setError('Please select a valid role (Patient, Doctor, or Pharmacist)');
          return;
        }

        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
          userType: selectedRole
        };

        const response = await authService.login(credentials);
        
        if (response.success) {
          setSuccess('Login successful!');
          onLogin(selectedRole);
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        // Handle registration
        if (!selectedRole || (selectedRole !== 'patient' && selectedRole !== 'doctor' && selectedRole !== 'pharmacist')) {
          setError('Please select a valid role (Patient, Doctor, or Pharmacist)');
          return;
        }

        if (selectedRole === 'patient') {
          // Validate required fields
          if (!formData.name || !formData.email || !formData.password || 
              !formData.phone || !formData.age || !formData.address) {
            setError('Please fill in all required fields');
            return;
          }

          // Validate age
          const age = parseInt(formData.age);
          if (isNaN(age) || age < 0 || age > 150) {
            setError('Please enter a valid age (0-150)');
            return;
          }

          // Validate password length
          if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
          }

          // Validate phone number format
          const phonePattern = /^[0-9+\-\s()]+$/;
          if (!phonePattern.test(formData.phone)) {
            setError('Phone number can only contain numbers, +, -, spaces, and parentheses');
            return;
          }

          const patientData: PatientRegistrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            age: age,
            gender: formData.gender,
            address: formData.address
          };

          console.log('Sending patient data:', JSON.stringify(patientData, null, 2));
          const response = await authService.registerPatient(patientData);
          
          if (response.success) {
            setSuccess('Registration successful! You are now logged in.');
            onLogin('patient');
          } else {
            console.error('Patient registration failed:', JSON.stringify(response, null, 2));
            // Show specific validation errors if available
            setError(response.message || 'Registration failed');
          }
        } else if (selectedRole === 'doctor') {
          // Validate required fields
          if (!formData.name || !formData.email || !formData.password || 
              !formData.specialization || !formData.hospital || 
              !formData.contact || !formData.license_number) {
            setError('Please fill in all required fields');
            return;
          }

          // Validate password length
          if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
          }

          // Validate contact number format
          const contactPattern = /^[0-9+\-\s()]+$/;
          if (!contactPattern.test(formData.contact)) {
            setError('Contact number can only contain numbers, +, -, spaces, and parentheses');
            return;
          }

          const doctorData: DoctorRegistrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            specialization: formData.specialization,
            hospital: formData.hospital,
            contact: formData.contact,
            license_number: formData.license_number
          };

          console.log('Sending doctor data:', JSON.stringify(doctorData, null, 2));
          const response = await authService.registerDoctor(doctorData);
          
          if (response.success) {
            setSuccess('Registration successful! You are now logged in.');
            onLogin('doctor');
          } else {
            console.error('Doctor registration failed:', JSON.stringify(response, null, 2));
            // Show specific validation errors if available
            setError(response.message || 'Registration failed');
          }
        } else if (selectedRole === 'pharmacist') {
          // Validate required fields
          if (!formData.name || !formData.email || !formData.password || 
              !formData.pharmacy_name || !formData.license_number || 
              !formData.contact || !formData.address) {
            setError('Please fill in all required fields');
            return;
          }

          // Validate password length
          if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
          }

          // Validate contact number format
          const contactPattern = /^[0-9+\-\s()]+$/;
          if (!contactPattern.test(formData.contact)) {
            setError('Contact number can only contain numbers, +, -, spaces, and parentheses');
            return;
          }

          const pharmacistData: PharmacistRegistrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            pharmacy_name: formData.pharmacy_name,
            license_number: formData.license_number,
            contact: formData.contact,
            address: formData.address
          };

          console.log('Sending pharmacist data:', JSON.stringify(pharmacistData, null, 2));
          const response = await authService.registerPharmacist(pharmacistData);
          
          if (response.success) {
            setSuccess('Registration successful! You are now logged in.');
            onLogin('pharmacist');
          } else {
            console.error('Pharmacist registration failed:', JSON.stringify(response, null, 2));
            // Show specific validation errors if available
            setError(response.message || 'Registration failed');
          }
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: 'patient' | 'doctor' | 'pharmacist') => {
    setSelectedRole(role);
    setError(null);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      age: '',
      gender: 'male',
      address: '',
      specialization: '',
      hospital: '',
      contact: '',
      license_number: '',
      pharmacy_name: ''
    });
  };

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center p-4 transition-all duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Enhanced Welcome Content */}
        <div className={`bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-3xl shadow-2xl space-y-8 transition-all duration-1000 ${fadeIn ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Nabha Telemedicine</h1>
              <p className="text-gray-300 text-sm font-medium">Connecting Rural Healthcare</p>
            </div>
          </div>
          
          {/* Main Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Healthcare is a{' '}
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                right
              </span>
              , not a{' '}
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                privilege
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Join thousands of healthcare providers and patients in revolutionizing 
              rural healthcare delivery across Punjab with cutting-edge technology.
            </p>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">Multilingual Support</h4>
                  <p className="text-gray-300 text-sm">Punjabi, Hindi & English</p>
                </div>
              </div>
            </div>
            
            <div className="group p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">Secure & Private</h4>
                  <p className="text-gray-300 text-sm">End-to-end encryption</p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">AI-Powered</h4>
                  <p className="text-gray-300 text-sm">Smart diagnostics</p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">24/7 Support</h4>
                  <p className="text-gray-300 text-sm">Always available</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side - Modern Login/Register Form */}
        <div className={`transition-all duration-1000 ${fadeIn ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
            <CardHeader className="space-y-4 pb-8 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {isLogin ? <Lock className="h-8 w-8 text-white" /> : <User className="h-8 w-8 text-white" />}
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <p className="text-gray-600 text-base">
                  {isLogin 
                    ? 'Sign in to access your healthcare dashboard'
                    : 'Join our healthcare community and make a difference'
                  }
                </p>
              </div>
            </CardHeader>
          
            <CardContent className="space-y-6 px-8 pb-8">
              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm animate-pulse">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Registration fields */}
                {!isLogin && (
                  <div className="space-y-3">
                    <label htmlFor="name" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="h-12 w-full border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 focus:outline-none rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="doctor@nabha.health"
                      className="h-12 w-full border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:outline-none rounded-xl pl-4 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="password" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="h-12 w-full border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 focus:outline-none rounded-xl pl-4 pr-12 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {!isLogin && formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Patient-specific registration fields */}
                {!isLogin && selectedRole === 'patient' && (
                  <>
                    <div className="space-y-3">
                      <label htmlFor="phone" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="h-12 border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label htmlFor="age" className="text-sm text-gray-700 font-semibold">
                          Age *
                        </label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="25"
                          className="h-12 border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 rounded-xl pl-4 transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="gender" className="text-sm text-gray-700 font-semibold">
                          Gender *
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="h-12 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-green-600/20 transition-all duration-300"
                          required
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="address" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address *
                      </label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Village, District, State"
                        className="h-12 border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Doctor-specific registration fields */}
                {!isLogin && selectedRole === 'doctor' && (
                  <>
                    <div className="space-y-3">
                      <label htmlFor="specialization" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Specialization *
                      </label>
                      <Input
                        id="specialization"
                        name="specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="Cardiology, General Medicine, etc."
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="hospital" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Hospital/Clinic *
                      </label>
                      <Input
                        id="hospital"
                        name="hospital"
                        type="text"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        placeholder="Hospital or Clinic name"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="contact" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Number *
                      </label>
                      <Input
                        id="contact"
                        name="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="license_number" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        License Number *
                      </label>
                      <Input
                        id="license_number"
                        name="license_number"
                        type="text"
                        value={formData.license_number}
                        onChange={handleInputChange}
                        placeholder="Medical license number"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Pharmacist-specific registration fields */}
                {!isLogin && selectedRole === 'pharmacist' && (
                  <>
                    <div className="space-y-3">
                      <label htmlFor="pharmacy_name" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Pharmacy Name *
                      </label>
                      <Input
                        id="pharmacy_name"
                        name="pharmacy_name"
                        type="text"
                        value={formData.pharmacy_name}
                        onChange={handleInputChange}
                        placeholder="Your pharmacy or drugstore name"
                        className="h-12 w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="contact" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Number *
                      </label>
                      <Input
                        id="contact"
                        name="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="h-12 w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="license_number" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        License Number *
                      </label>
                      <Input
                        id="license_number"
                        name="license_number"
                        type="text"
                        value={formData.license_number}
                        onChange={handleInputChange}
                        placeholder="Pharmacy license number"
                        className="h-12 w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl pl-4 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="address" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Pharmacy Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Complete pharmacy address"
                        className="h-24 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none resize-none text-sm transition-all duration-300"
                        required
                      />
                    </div>
                  </>
                )}
                
                {/* Form Controls */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-200">Remember me</span>
                  </label>
                  <button type="button" className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
                    Forgot password?
                  </button>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={!selectedRole || loading}
                  className={`w-full h-14 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    selectedRole && !loading
                      ? 'bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : selectedRole ? (
                    <div className="flex items-center gap-3">
                      <span>
                        {isLogin 
                          ? `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
                          : `Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account`
                        }
                      </span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  ) : (
                    'Select a role to continue'
                  )}
                </Button>
              </form>
              
              {/* Role Selection */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Select your role</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className={`h-16 border-2 text-left justify-start rounded-2xl transition-all duration-300 group ${
                      selectedRole === 'patient' 
                        ? 'border-green-600 bg-green-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:bg-green-50 hover:border-green-300 hover:scale-105'
                    }`}
                    onClick={() => handleRoleSelect('patient')}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">Patient</div>
                      <div className="text-sm text-gray-600">Access healthcare services</div>
                    </div>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className={`h-16 border-2 text-left justify-start rounded-2xl transition-all duration-300 group ${
                      selectedRole === 'doctor' 
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105'
                    }`}
                    onClick={() => handleRoleSelect('doctor')}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">👨‍⚕️</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">Doctor</div>
                      <div className="text-sm text-gray-600">Provide medical consultations</div>
                    </div>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className={`h-16 border-2 text-left justify-start rounded-2xl transition-all duration-300 group ${
                      selectedRole === 'pharmacist' 
                        ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:scale-105'
                    }`}
                    onClick={() => handleRoleSelect('pharmacist')}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">Pharmacist</div>
                      <div className="text-sm text-gray-600">Manage pharmacy inventory</div>
                    </div>
                  </Button>
                </div>
              </div>
              
              
              {/* Toggle Mode */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? (
                    <>
                      Don't have an account?{' '}
                      <button 
                        type="button"
                        onClick={toggleMode}
                        className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Sign up here
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        type="button"
                        onClick={toggleMode}
                        className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Sign in here
                      </button>
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
 