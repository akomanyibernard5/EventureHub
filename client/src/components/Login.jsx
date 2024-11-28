import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSuccess = async (googleResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      const googleAccessToken = googleResponse.access_token;
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleAccessToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Google');
      }

      const userInfo = await response.json();
      if (userInfo && userInfo.token) {
        localStorage.setItem('token', userInfo.token);
        updateUserProfile({
          fullName: userInfo.name,
          profilePicture: userInfo.avatar,
        });
        navigate('/events');
      } else {
        throw new Error('Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Failed to log in with Google:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess,
    onError: () => setError('Google login failed. Please try again'),
  });

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        toast.success('Login successful!', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
        })
        navigate('/dashboard')
      } else {
        toast.error(data.message || 'Invalid credentials', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Error logging in. Please try again.', {
        position: 'top-right',
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
      })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const backendResponse = await fetch('http://localhost:8000/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: response.access_token
          })
        });

        const data = await backendResponse.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
          toast.success('Successfully signed in with Google!');
          navigate('/dashboard');
        } else {
          toast.error(data.message || 'Failed to login with Google');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Failed to sign in with Google');
      }
    },
    onError: () => {
      toast.error('Google sign in failed');
    },
    flow: 'implicit',
    ux_mode: 'popup',
  });

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">Welcome to EventureHub</h1>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Your one-stop platform for discovering, creating, and managing amazing events. 
              Connect with event organizers and attendees from around the world.
            </p>
            <div className="space-y-4">

              {[
                'Discover Local & Global Events',
                'Easy Event Creation & Management',
                'Real-time Event Updates',
                'Secure Ticket Booking System'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-white">
                  <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <p className="text-white/90 italic mb-4">
              "EventureHub has revolutionized how we organize our tech conferences. 
              The platform's features and user experience are unmatched. It's made 
              event management a breeze!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center text-primary-700 font-bold">
                BD
              </div>
              <div>
                <p className="text-white font-medium">Bernard Akomanyi</p>
                <p className="text-primary-200 text-sm">Developer of EventureHub</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/50 to-secondary-600/50" />
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:20px_20px]" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Sign in to your account</h2>
            <p className="mt-3 text-gray-400">Welcome back! Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 
                           text-white rounded-lg focus:ring-2 focus:ring-primary-500/30 
                           focus:border-primary-500 transition-colors duration-200"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 
                           text-white rounded-lg focus:ring-2 focus:ring-primary-500/30 
                           focus:border-primary-500 transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-gray-300 focus:outline-none focus:text-gray-300
                           transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 
                           focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-base font-medium text-white 
                       bg-gradient-to-r from-primary-500 to-secondary-500 
                       rounded-lg shadow-lg hover:from-primary-600 hover:to-secondary-600
                       focus:outline-none focus:ring-2 focus:ring-primary-500/30
                       disabled:opacity-70 disabled:cursor-not-allowed
                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Not a member yet?{' '}
              <Link 
                to="/signup" 
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
          </form>

          {/* <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div> */}

            {/* <div className="mt-6">
              <button
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 
                         border border-gray-700 rounded-xl text-gray-300 
                         hover:bg-gray-800 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" 
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" 
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" 
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" 
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default Login 