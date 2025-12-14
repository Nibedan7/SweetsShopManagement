import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Candy, Eye, EyeOff, Loader2, Cookie, IceCream, Lollipop, Sparkles, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login,isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('sweetshop_user') || '{}');
      
      navigate(user.is_admin ? '/admin' : '/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 text-pink-400 opacity-20 animate-pulse">
          <Cookie className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute top-40 right-20 text-purple-400 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <Lollipop className="w-24 h-24 transform -rotate-12" />
        </div>
        <div className="absolute bottom-20 left-1/3 text-indigo-400 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>
          <IceCream className="w-28 h-28" />
        </div>
        
        {/* Floating Candy Elements */}
        <div className="absolute top-1/4 left-1/4 text-pink-300 animate-float" style={{ animationDelay: '0s' }}>
          <span className="text-6xl">🍬</span>
        </div>
        <div className="absolute top-1/3 right-1/4 text-purple-300 animate-float" style={{ animationDelay: '1s' }}>
          <span className="text-5xl">🧁</span>
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-indigo-300 animate-float" style={{ animationDelay: '2s' }}>
          <span className="text-7xl">🍩</span>
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-pink-300 animate-float" style={{ animationDelay: '1.5s' }}>
          <span className="text-6xl">🍭</span>
        </div>
        <div className="absolute top-1/2 left-1/5 text-purple-300 animate-float" style={{ animationDelay: '0.5s' }}>
          <span className="text-5xl">🍪</span>
        </div>
        <div className="absolute top-2/3 right-1/5 text-indigo-300 animate-float" style={{ animationDelay: '2.5s' }}>
          <span className="text-6xl">🍰</span>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo with animated glow effect */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Candy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-30 blur-lg animate-pulse"></div>
            </div>
            <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Sweet Shop
            </h1>
            <p className="text-gray-600 mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Management System
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </p>
          </div>

          {/* Login Card with Glassmorphism */}
          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-8 animate-scale-in">
            <h2 className="font-display text-2xl font-semibold text-gray-800 mb-6 text-center">
              Welcome Back
            </h2>

            

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>

          {/* Candy-themed footer */}
          <div className="flex justify-center mt-6 gap-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍬</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍭</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🧁</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🍩</span>
            <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🍪</span>
          </div>
        </div>
      </div>
    </div>
  );
}