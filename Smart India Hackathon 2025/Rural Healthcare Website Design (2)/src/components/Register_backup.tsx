import React, { useState, useEffect } from 'react';
import { Heart, Smartphone, Shield, Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, Sparkles, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import HealthcareCarousel  from './ui/healthcareCarousel';
interface RegisterPageProps {
  onRegistrationSuccess: () => void;  // when signup is successful
  onShowLogin: () => void;  // when user clicks "Sign in here"
}

export default function RegistrationPage({  onRegistrationSuccess,onShowLogin }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmpassword:'',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_type: "patient",
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: "1234567890",
          address: "Sample Address"
        }),
      });

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          onRegistrationSuccess();
        }, 2000);
      } else {
        const error = await response.json();
        setError(error.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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

          {/* Healthcare Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <HealthcareCarousel />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="text-2xl mb-2 font-bold">Transforming Rural Healthcare</h4>
              <p className="text-lg opacity-90">Connecting communities through technology</p>
            </div>
          </div>
        </div>

        {/* Right Side - Modern Registration Form */}
        <div className={`transition-all duration-1000 ${fadeIn ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
            <CardHeader className="space-y-4 pb-8 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </CardTitle>
                <p className="text-gray-600 text-base">
                  Join our healthcare community and make a difference
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
                {/* Full Name */}
                <div className="space-y-3">
                  <label htmlFor="fullName" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 focus:outline-none rounded-xl pl-4 transition-all duration-300"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@nabha.health"
                    className="h-12 w-full border-2 border-gray-200 focus:border-green-600 focus:ring-green-600/20 focus:outline-none rounded-xl pl-4 transition-all duration-300"
                    required
                  />
                </div>

                {/* Password */}
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
                  {formData.password && (
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

                {/* Confirm Password */}
                <div className="space-y-3">
                  <label htmlFor="confirmpassword" className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmpassword"
                      name="confirmpassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmpassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
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
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    !loading
                      ? 'bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={onShowLogin}
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}