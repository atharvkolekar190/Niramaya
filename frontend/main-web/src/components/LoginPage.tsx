import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, User, Stethoscope, Pill, ArrowRight, Building2, FileText, MapPin, Shield, Brain, Clock, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { authService, type LoginCredentials, type PatientRegistrationData, type DoctorRegistrationData, type PharmacistRegistrationData } from '../services/authService';
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LoginPageProps {
  onLogin: (userRole: 'patient' | 'doctor' | 'pharmacist') => void;
}

// FeaturePanel component integrated directly
const FeaturePanel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const features = [
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in Punjabi, Hindi & English"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption for all data"
    },
    {
      icon: Brain,
      title: "AI-Powered Diagnostics",
      description: "Smart health insights and recommendations"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock healthcare assistance"
    }
  ];

  const images = [
    "https://images.unsplash.com/photo-1659353887211-1a3aa8426aa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwZG9jdG9ycyUyMHRlY2hub2xvZ3klMjBtb2Rlcm58ZW58MXx8fHwxNzU3ODc4NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1691934286085-c88039d93dae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uc3VsdGF0aW9uJTIwZGlnaXRhbCUyMGhlYWx0aHxlbnwxfHx8fDE3NTc4Nzg0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1582146804102-b4a01b0a51ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHRlY2hub2xvZ3klMjBoZWFsdGhjYXJlJTIwbW9kZXJufGVufDF8fHx8MTc1Nzg3ODQ4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="m 40 0 l 0 40 m -40 0 l 40 0" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Sliding Images Background */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentImageIndex ? 0.1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <ImageWithFallback
              src={image}
              alt="Healthcare Technology"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white text-2xl">♥</span>
            </div>
            <h1 className="text-4xl mb-2">
              Nabha<span className="text-green-600">.health</span>
            </h1>
            <p className="text-gray-600">
              Healthcare is a <span className="text-green-600 font-medium">right</span>, not privilege.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 mb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <feature.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

const roles = [
  { value: "patient", label: "Patient", icon: User },
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "pharmacist", label: "Pharmacist", icon: Pill }
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'pharmacist'>('patient');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    // Doctor specific
    specialization: "",
    hospitalClinicName: "",
    medicalLicenseNumber: "",
    // Pharmacist specific
    pharmacyName: "",
    pharmacyLicenseNumber: "",
    pharmacyAddress: ""
  });

  const selectedRoleData = roles.find(role => role.value === selectedRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", { ...formData, role: selectedRole, rememberMe });
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Basic validation
        if (!formData.email || !formData.password) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // Handle login
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
          userType: selectedRole
        };

        console.log("Attempting login with credentials:", credentials);
        const response = await authService.login(credentials);
        console.log("Login response:", response);
        
        if (response.success) {
          setSuccess('Login successful!');
          onLogin(selectedRole);
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        // Handle registration
        if (selectedRole === 'patient') {
          const patientData: PatientRegistrationData = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phoneNumber,
            age: 25, // Default age, you can add age field if needed
            gender: 'male', // Default gender, you can add gender field if needed
            address: 'Default Address' // Default address, you can add address field if needed
          };

          const response = await authService.registerPatient(patientData);
          
          if (response.success) {
            setSuccess('Registration successful! You are now logged in.');
            onLogin('patient');
          } else {
            setError(response.message || 'Registration failed');
          }
        } else if (selectedRole === 'doctor') {
          const doctorData: DoctorRegistrationData = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            specialization: formData.specialization,
            hospital: formData.hospitalClinicName,
            contact: formData.phoneNumber,
            license_number: formData.medicalLicenseNumber
          };

          const response = await authService.registerDoctor(doctorData);
          
          if (response.success) {
            setSuccess('Registration successful! You are now logged in.');
            onLogin('doctor');
          } else {
            setError(response.message || 'Registration failed');
          }
        } else if (selectedRole === 'pharmacist') {
          const pharmacistData: PharmacistRegistrationData = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            pharmacy_name: formData.pharmacyName,
            license_number: formData.pharmacyLicenseNumber,
            contact: formData.phoneNumber,
            address: formData.pharmacyAddress
          };

          const response = await authService.registerPharmacist(pharmacistData);
          
          if (response.success) {
            setSuccess('Registration successful! You are now logged in.');
            onLogin('pharmacist');
          } else {
            setError(response.message || 'Registration failed');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setFormData({
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      specialization: "",
      hospitalClinicName: "",
      medicalLicenseNumber: "",
      pharmacyName: "",
      pharmacyLicenseNumber: "",
      pharmacyAddress: ""
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features & Marketing */}
      <div className="hidden lg:flex lg:w-1/2">
        <FeaturePanel />
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2">
        <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                {selectedRoleData && <selectedRoleData.icon className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-3xl mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? "Sign in to access your healthcare dashboard" 
                  : "Join our healthcare community and make a difference"
                }
              </p>
            </motion.div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Label className="mb-3 block">Select Your Role</Label>
              <Select value={selectedRole} onValueChange={(value: 'patient' | 'doctor' | 'pharmacist') => setSelectedRole(value)}>
                <SelectTrigger className="h-14 bg-white shadow-sm border border-gray-200 rounded-lg px-4">
                  <SelectValue>
                    <div className="flex items-center space-x-3">
                      {selectedRoleData && (
                        <>
                          <selectedRoleData.icon className="w-5 h-5 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium">{selectedRoleData.label}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center space-x-3 py-2">
                        <role.icon className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">{role.label}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Full Name (only for signup) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 mt-2"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={selectedRole === "doctor" ? "doctor@nabha.health" : selectedRole === "pharmacist" ? "pharmacist@nabha.health" : `${selectedRole}@nabha.health`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 mt-2"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone Number (only for signup) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="phoneNumber">Contact Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="h-12 mt-2"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              {/* Doctor-specific fields (only for doctor signup) */}
              {!isLogin && selectedRole === "doctor" && (
                <>
                  {/* Specialization */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="specialization" className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Specialization *
                    </Label>
                    <Input
                      id="specialization"
                      type="text"
                      placeholder="Cardiology, General Medicine, etc."
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      className="h-12 mt-2"
                      required={!isLogin && selectedRole === "doctor"}
                    />
                  </motion.div>

                  {/* Hospital/Clinic */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="hospitalClinicName" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Hospital/Clinic *
                    </Label>
                    <Input
                      id="hospitalClinicName"
                      type="text"
                      placeholder="Hospital or Clinic name"
                      value={formData.hospitalClinicName}
                      onChange={(e) => handleInputChange("hospitalClinicName", e.target.value)}
                      className="h-12 mt-2"
                      required={!isLogin && selectedRole === "doctor"}
                    />
                  </motion.div>

                  {/* Medical License Number */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="medicalLicenseNumber" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      License Number *
                    </Label>
                    <Input
                      id="medicalLicenseNumber"
                      type="text"
                      placeholder="Medical license number"
                      value={formData.medicalLicenseNumber}
                      onChange={(e) => handleInputChange("medicalLicenseNumber", e.target.value)}
                      className="h-12 mt-2"
                      required={!isLogin && selectedRole === "doctor"}
                    />
                  </motion.div>
                </>
              )}

              {/* Pharmacy-specific fields (only for pharmacist signup) */}
              {!isLogin && selectedRole === "pharmacist" && (
                <>
                  {/* Pharmacy Name */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="pharmacyName" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Pharmacy Name *
                    </Label>
                    <Input
                      id="pharmacyName"
                      type="text"
                      placeholder="Your pharmacy or drugstore name"
                      value={formData.pharmacyName}
                      onChange={(e) => handleInputChange("pharmacyName", e.target.value)}
                      className="h-12 mt-2"
                      required={!isLogin && selectedRole === "pharmacist"}
                    />
                  </motion.div>

                  {/* License Number */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="licenseNumber" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      License Number *
                    </Label>
                    <Input
                      id="pharmacyLicenseNumber"
                      type="text"
                      placeholder="Pharmacy license number"
                      value={formData.pharmacyLicenseNumber}
                      onChange={(e) => handleInputChange("pharmacyLicenseNumber", e.target.value)}
                      className="h-12 mt-2"
                      required={!isLogin && selectedRole === "pharmacist"}
                    />
                  </motion.div>

                  {/* Pharmacy Address */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="pharmacyAddress" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Pharmacy Address *
                    </Label>
                    <Input
                      id="pharmacyAddress"
                      type="text"
                      placeholder="Complete pharmacy address"
                      value={formData.pharmacyAddress}
                      onChange={(e) => handleInputChange("pharmacyAddress", e.target.value)}
                      className="h-12 mt-2"
                      required={!isLogin && selectedRole === "pharmacist"}
                    />
                  </motion.div>
                </>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                {isLogin && (
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                  </div>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : `Create ${selectedRoleData?.label} Account`}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center">
                <span className="text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-green-600 hover:text-green-700 transition-colors font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </motion.form>

          </div>
        </div>
      </div>
    </div>
  );
}