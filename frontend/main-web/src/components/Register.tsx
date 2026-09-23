import React, { useState } from 'react';
import { Heart, Smartphone, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import HealthcareCarousel  from './ui/healthcareCarousel';
interface RegisterPageProps {
  onRegistrationSuccess: () => void;  // when signup is successful
  onShowLogin: () => void;  // when user clicks "Sign in here"
  onShowEmergency?: () => void;
}

export default function RegistrationPage({  onRegistrationSuccess,onShowLogin,onShowEmergency }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmpassword:'',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password!=formData.confirmpassword) {
      alert("Passwords do not match");
      return ;
    }
    try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_type: "patient",  // or "doctor" / "pharmacist"
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: "1234567890",   // add input later
        address: "Sample Address" // add input later
      }),
    });

    if (response.ok) {
      alert("Registration successful!");
      onRegistrationSuccess(); // redirect to login after signup
    } else {
      const error = await response.json();
      alert(error.error || "Registration failed");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong");
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Welcome Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-900">Nabha Telemedicine</h1>
              <p className="text-sm text-gray-600">Connecting Rural Healthcare</p>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            Healthcare is a 
            <span className="text-green-600"> right</span>, not a 
            <span className="text-blue-600"> privilege</span>
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Join thousands of healthcare providers and patients in revolutionizing 
            rural healthcare delivery across Punjab.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-gray-900 text-sm">Multilingual App</h4>
                <p className="text-xs text-gray-600">Available in Punjabi, Hindi, and English</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-gray-900 text-sm">Secure & Private</h4>
                <p className="text-xs text-gray-600">End-to-end encrypted consultations</p>
              </div>
            </div>
          </div>

          {/* Healthcare Image */}
          <div className="relative rounded-xl overflow-hidden shadow-lg">
          
            <HealthcareCarousel />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-lg mb-1">Transforming Rural Healthcare</h4>
              <p className="text-sm opacity-90">Connecting communities through technology</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registractionn Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-900">Welcome to Nabha Telemedicine</CardTitle>
            <p className="text-center text-gray-600 text-sm">
             Join Nabha Telemedicine today
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/*Full Name*/}
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm text-gray-700">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doctor@nabha.health"
                  className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
               {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

               {/* Confirm Password */}          
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmpassword"
                    name="confirmpassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmpassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                  />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
           <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
             onClick={onShowLogin}
               className="text-green-600 hover:text-green-700">
                Sign in here
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}