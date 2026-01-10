import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/Appcontext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formStep, setFormStep] = useState(1);

  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for strength calculation
  const password = watch("password");
  
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 6) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const mutation = useMutation(apiClient.register, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      showToast({
        message: "🎉 Welcome aboard! Your account has been created successfully.",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({
        message: error.message || "Registration failed. Please try again.",
        type: "ERROR",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const nextStep = async () => {
    const isValid = await trigger(["firstName", "lastName", "email"]);
    if (isValid) {
      setFormStep(2);
    }
  };

  const previousStep = () => {
    setFormStep(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const formSteps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Security", icon: Shield },
  ];

  const passwordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Column - Visual/Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-2/5 bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-8 lg:p-12 flex flex-col justify-between"
        >
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-2xl font-bold">Avaly.com</span>
                  <p className="text-blue-200 text-sm">Premium hotel/AirBnb Booking Platform</p>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Start Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  Journey Today
                </span>
              </h1>

              <p className="text-blue-100 text-lg mb-8">
                Join our community of travelers and unlock exclusive benefits from day one.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: "🎯",
                  title: "Personalized Recommendations",
                  description: "Get tailored suggestions based on your travel style"
                },
                {
                  icon: "⚡",
                  title: "Exclusive Member Rates",
                  description: "Access prices available only to registered users"
                },
                {
                  icon: "🎁",
                  title: "Welcome Bonus",
                  description: "Earn rewards on your first booking"
                },
                {
                  icon: "🛡️",
                  title: "Priority Support",
                  description: "24/7 dedicated support for members"
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <div className="font-semibold text-lg mb-1">{benefit.title}</div>
                    <div className="text-sm text-blue-200">{benefit.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-blue-200">Already have an account?</p>
                <Link
                  to="/sign-in"
                  className="text-white font-semibold hover:text-blue-300 transition-colors inline-flex items-center gap-2"
                >
                  Sign In Here
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="text-4xl">✨</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:w-3/5 p-8 lg:p-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Create Your Account
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Community
            </h2>
            <p className="text-gray-600">
              Start your travel journey in just a few steps
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-10 transition-all duration-300"
                style={{ width: `${(formStep - 1) * 50}%` }}
              />
              {formSteps.map((step) => (
                <div key={step.id} className="relative z-20">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      formStep >= step.id
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-400 border-2 border-gray-300"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 text-sm font-medium whitespace-nowrap ${
                      formStep >= step.id ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <form onSubmit={onSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {formStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register("firstName", {
                            required: "First name is required",
                            minLength: {
                              value: 2,
                              message: "Minimum 2 characters",
                            },
                          })}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="John"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          ⚠️ {errors.firstName.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register("lastName", {
                            required: "Last name is required",
                            minLength: {
                              value: 2,
                              message: "Minimum 2 characters",
                            },
                          })}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Doe"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          ⚠️ {errors.lastName.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="you@example.com"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        ⚠️ {errors.email.message}
                      </motion.p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      We'll send a verification email to this address
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
                    >
                      Continue to Security
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {formStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                          },
                          pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)/,
                            message: "Must contain letters and numbers",
                          },
                        })}
                        className="pl-10 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Create a strong password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    {password && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Password strength</span>
                          <span className={`font-semibold ${
                            passwordStrength >= 75 ? "text-green-600" :
                            passwordStrength >= 50 ? "text-yellow-600" :
                            passwordStrength >= 25 ? "text-orange-600" :
                            "text-red-600"
                          }`}>
                            {passwordStrength >= 75 ? "Strong" :
                             passwordStrength >= 50 ? "Good" :
                             passwordStrength >= 25 ? "Fair" :
                             "Weak"}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${passwordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        
                        {/* Password Requirements */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {[
                            { text: "At least 6 characters", valid: password.length >= 6 },
                            { text: "Contains letters", valid: /[A-Za-z]/.test(password) },
                            { text: "Contains numbers", valid: /\d/.test(password) },
                            { text: "Mixed case (optional)", valid: /[A-Z]/.test(password) && /[a-z]/.test(password) },
                          ].map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {req.valid ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                              )}
                              <span className={`text-sm ${req.valid ? "text-green-600" : "text-gray-500"}`}>
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        ⚠️ {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (val) => {
                            if (!val) return "This field is required";
                            if (watch("password") !== val) {
                              return "Passwords do not match";
                            }
                          },
                        })}
                        className="pl-10 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Re-enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        ⚠️ {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                      . I understand that my data will be processed in accordance with these policies.
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={previousStep}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !isValid}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <Briefcase className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Note */}
            <motion.div
              variants={itemVariants}
              className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Your security is our priority</p>
                  <p>
                    We use bank-level encryption to protect your data. Your password is hashed and never stored in plain text.
                  </p>
                </div>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;