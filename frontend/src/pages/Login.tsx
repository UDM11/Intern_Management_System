import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Lock, Eye, EyeOff, Shield, Users, TrendingUp, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [mounted, setMounted] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Users, text: "Manage Interns", color: "bg-blue-500" },
    { icon: TrendingUp, text: "Track Progress", color: "bg-green-500" },
    { icon: Shield, text: "Secure Platform", color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center relative z-10">
        {/* Left Side - Branding & Features */}
        <div className={`hidden lg:block space-y-6 xl:space-y-8 px-4 xl:px-8 ${mounted ? 'animate-in fade-in duration-1000' : 'opacity-0'}`}>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Intern Management
                </h1>
                <p className="text-sm xl:text-base text-slate-600 dark:text-slate-400">Professional Platform</p>
              </div>
            </div>
            
            <p className="text-base xl:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Streamline your internship program with our comprehensive management system. 
              Track progress, assign tasks, and manage interns efficiently.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg xl:text-xl font-semibold text-slate-800 dark:text-slate-200">Key Features</h3>
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-2.5 xl:p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 ${mounted ? 'animate-in fade-in duration-1000' : 'opacity-0'}`}
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className={`w-8 h-8 xl:w-10 xl:h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                    </div>
                    <span className="text-sm xl:text-base text-slate-700 dark:text-slate-300 font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* Right Side - Login Form */}
        <div className={`w-full max-w-md mx-auto lg:mx-0 px-4 sm:px-0 ${mounted ? 'animate-in fade-in zoom-in-95 duration-700 lg:animate-in lg:slide-in-from-right lg:duration-1000' : 'opacity-0'}`}>
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/50 shadow-2xl shadow-blue-500/10">
            <CardHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-blue-500/25">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Sign in to access your admin dashboard
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 sm:h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 text-slate-700 dark:text-slate-300 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                onClick={() => {
                  console.log('Google Sign In clicked');
                }}
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm sm:text-base">Continue with Google</span>
                </div>
              </Button>

              <div className="relative">
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white dark:bg-slate-900 px-2 sm:px-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-11 sm:h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                        errors.email ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 animate-in slide-in-from-top duration-200">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 h-11 sm:h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                        errors.password ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 animate-in slide-in-from-top duration-200">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="text-sm sm:text-base">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      <span className="text-sm sm:text-base">Sign In Securely</span>
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Demo Access Available
                </p>
                <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Use any email and password to access the demo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
