// File: src/components/auth/Login.jsx
// Login component for user authentication

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateForm } from "../../utils/validation";
import { parseFirebaseAuthError } from "../../utils/errorHandlers";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    login,
    signInWithGoogle,
    signInWithFacebook,
    resendVerificationEmail,
  } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationRules = {
      email: { required: true, email: true },
      password: { required: true },
    };

    const { isValid, errors } = validateForm(formData, validationRules);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setLoginError("");
    setNeedsVerification(false);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      // Check if the error is due to email not being verified
      if (error.message && error.message.includes("Email not verified")) {
        setNeedsVerification(true);
        setLoginError(
          "Please verify your email before logging in. Check your inbox for a verification link."
        );
      } else {
        setLoginError(parseFirebaseAuthError(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    setResendSuccess(false);

    try {
      await resendVerificationEmail();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      setLoginError(parseFirebaseAuthError(error));
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginError("");
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setLoginError(parseFirebaseAuthError(error));
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoginError("");
      await signInWithFacebook();
      navigate("/dashboard");
    } catch (error) {
      setLoginError(parseFirebaseAuthError(error));
    }
  };

  return (
    <div className="auth-container">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="blob-1 animate-blob-slow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="blob-2 animate-blob-slow animation-delay-2000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="blob-3 animate-blob-slow animation-delay-4000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="auth-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            className="auth-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Sign in to continue to your account
          </motion.p>
        </div>

        {loginError && (
          <motion.div
            className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{loginError}</p>
            {needsVerification && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingEmail}
                  className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                >
                  {isResendingEmail
                    ? "Sending..."
                    : "Resend verification email"}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {resendSuccess && (
          <motion.div
            className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg mb-6"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>
              Verification email sent successfully! Please check your inbox.
            </p>
          </motion.div>
        )}

        {/* Social Login Buttons */}
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="social-login-btn-glass w-full"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                fill="#FFC107"
              />
              <path
                d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
                fill="#FF3D00"
              />
              <path
                d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
                fill="#4CAF50"
              />
              <path
                d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                fill="#1976D2"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="social-login-btn-glass w-full"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                fill="#1877F2"
              />
              <path
                d="M15.893 14.89L16.336 12H13.563V10.124C13.563 9.333 13.95 8.562 15.193 8.562H16.453V6.102C16.453 6.102 15.309 5.907 14.215 5.907C11.93 5.907 10.438 7.291 10.438 9.797V12H7.898V14.89H10.438V21.879C11.052 21.959 11.674 22 12.305 22C12.926 22 13.538 21.959 14.142 21.879V14.89H15.893Z"
                fill="white"
              />
            </svg>
            Continue with Facebook
          </button>
        </motion.div>

        {/* Divider */}
        <div className="form-divider">
          <span className="form-divider-text">or</span>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input-glass w-full px-4 py-2 rounded-lg"
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-error-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input-glass w-full px-4 py-2 rounded-lg pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-error-600">
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-glass w-full py-2 px-4 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </div>
        </motion.form>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
