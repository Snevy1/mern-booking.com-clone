import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/Appcontext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      showToast({
        message: "Welcome back! Sign in successful",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: async (error: Error) => {
      showToast({
        message: error.message || "Invalid credentials. Please try again.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Column - Brand/Visual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-8 lg:p-12 flex flex-col justify-between"
        >
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-xl font-semibold">SecureAuth</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Welcome Back
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  Guest
                </span>
              </h1>
              
              <p className="text-blue-100 text-lg mb-8">
                Sign in to continue your journey. Access your bookings, preferences, and exclusive member benefits.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: "🎯",
                  title: "Personalized Experience",
                  description: "Get recommendations based on your travel history"
                },
                {
                  icon: "⚡",
                  title: "Fast Booking",
                  description: "Complete reservations in seconds"
                },
                {
                  icon: "🔒",
                  title: "Secure & Private",
                  description: "Your data is protected with enterprise-grade security"
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-sm text-blue-200">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-blue-200">
              Trusted by over 50,000 travelers worldwide
            </p>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:w-1/2 p-8 lg:p-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Secure Sign In
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Access Your Account
            </h2>
            <p className="text-gray-600">
              Enter your credentials to continue
            </p>
          </motion.div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
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
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      ⚠️ {errors.email.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="pl-10 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
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
                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      ⚠️ {errors.password.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Password Strength Indicator (for demo) */}
            {watch("password") && !errors.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="text-sm text-gray-600">Password strength</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        watch("password").length >= level * 2
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                Create New Account
              </Link>
            </motion.div>

            {/* Demo Credentials (for testing) */}
            <motion.div
              variants={itemVariants}
              className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <p className="text-sm text-gray-600 text-center">
                For demo purposes, you can use:
                <br />
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  demo@example.com / password123
                </code>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;