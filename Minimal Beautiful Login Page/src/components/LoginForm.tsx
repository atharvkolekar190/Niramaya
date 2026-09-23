import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, User, Stethoscope, Pill, ArrowRight, Building2, FileText, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const roles = [
  { value: "patient", label: "Patient", icon: User },
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "pharmacist", label: "Pharmacist", icon: Pill }
];

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "doctor@nabha.health",
    password: "",
    fullName: "",
    phoneNumber: "+91 98765 43210",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", { ...formData, role: selectedRole, rememberMe });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
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

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Label className="mb-3 block">Select Your Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="h-14">
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
            <SelectContent>
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
            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 group"
          >
            <span>{isLogin ? "Sign In" : `Create ${selectedRoleData?.label} Account`}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Toggle Login/Signup */}
          <div className="text-center">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-700 transition-colors font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </motion.form>

      </div>
    </div>
  );
}