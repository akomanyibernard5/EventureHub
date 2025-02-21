import React, { useState, useContext, useEffect } from 'react';
import { EventContext } from "../../contexts/EventContext.jsx";
import toast from 'react-hot-toast';

const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
    const {  activeSection, url } = useContext(EventContext);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${url}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsProcessing(false);
        setStep(2);
        toast.success(result.message, {
          duration: 1500,
        });
      }
      else {
        setIsProcessing(false);
        toast.error(result.message);
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error('An error occurred while sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${url}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsProcessing(false);
        setStep(3);
        toast.success(result.message, {
          duration: 1500,
        });
      } else {
        setIsProcessing(false);
        setStep(1)
        toast.error(result.message);
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error('An error occurred while verifying OTP.');
    }
  };

  const handleResetPassword = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${url}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsProcessing(false);
        toast.success(result.message, {
          duration: 1500,
        });
        onClose()
      } else {
        setIsProcessing(false);
        toast.error(result.message);
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error('An error occurred while resetting the password.');
    }
  };


  const handleClose = async () => {
    setStep(1)
    onClose()
    setEmail("")
    setOtp("")
    setConfirmPassword("")
    setNewPassword("")
  }

  useEffect(() => {
    document.title = "EventureHub - Password Reset";
  }, [activeSection]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md shadow-lg border border-gray-700 animate-fade-in">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
          </h2>
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={handleClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          {step === 1 && (
            <>
              <p className="text-sm text-gray-400">
                Enter your email address to receive a one-time password (OTP).
              </p>
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className={`w-full p-3 rounded-md text-white font-semibold flex items-center justify-center gap-2 transition ${isProcessing
                  ? 'bg-gray-500 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                onClick={handleSendOtp}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin text-white"
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-gray-400">
                Enter the 6-digit OTP sent to <strong>{email}</strong>.
              </p>
              <input
                type="text"
                placeholder="OTP"
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600 outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className={`w-full p-3 rounded-md text-white font-semibold flex items-center justify-center gap-2 transition ${isProcessing
                  ? 'bg-gray-500 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                onClick={handleVerifyOtp}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin text-white"
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <p className="text-sm text-gray-400">
                Enter and confirm your new password.
              </p>
              <input
                type="password"
                placeholder="New password"
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className={`w-full p-3 rounded-md text-white font-semibold flex items-center justify-center gap-2 transition ${isProcessing
                  ? 'bg-gray-500 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                onClick={handleResetPassword}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin text-white"
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
