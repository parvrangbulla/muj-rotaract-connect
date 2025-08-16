
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Users, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { devAuthService } from '@/services/auth-dev.service';
import AnimatedBackground from '@/components/AnimatedBackground';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDevInfo, setShowDevInfo] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInAsGuest, user, loading } = useAuth();
  
  // Debug: Log auth state
  console.log('🔍 Auth state - User:', user, 'Loading:', loading);

  // Check if we're in development mode
  const isFirebaseConfigured = () => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    return apiKey && apiKey !== "your-api-key";
  };

  const demoAccounts = devAuthService.getDemoAccounts();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log('👤 User already logged in, redirecting:', user);
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting login with:', formData.email);
      if (formData.email && formData.password) {
        const user = await signIn(formData.email, formData.password);
        console.log('✅ Login successful:', user);
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      console.log('👤 Attempting guest access');
      const user = await signInAsGuest();
      console.log('✅ Guest access successful:', user);
      navigate('/');
    } catch (error: any) {
      console.error('❌ Guest access failed:', error);
      setError(error.message || 'Failed to access as guest.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
              alt="Rotaract Club MUJ Logo" 
              className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-full border-2 border-rotaract-orange/50 p-1"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm md:text-base">Sign in to access your dashboard</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-center text-white">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-600 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90 text-white text-sm md:text-base py-2 md:py-3"
                disabled={isLoading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">or</span>
                </div>
              </div>
              
              <Button
                onClick={handleGuestAccess}
                variant="outline"
                className="w-full mt-4 border-gray-400 text-gray-200 bg-gray-800/30 hover:bg-white/20 hover:border-white hover:text-white transition-all duration-200 text-sm md:text-base py-2 md:py-3"
                disabled={isLoading}
              >
                <Users className="w-4 h-4 mr-2" />
                {isLoading ? 'Loading...' : 'Continue as Guest'}
              </Button>
            </div>

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-gray-400 text-xs md:text-sm">
                Don't have an account? Contact your club administrator
              </p>
            </div>

            {/* Demo Accounts Info */}
            <div className="mt-4">
              <Button
                onClick={() => setShowDevInfo(!showDevInfo)}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                size="sm"
              >
                <Info className="w-4 h-4 mr-2" />
                {showDevInfo ? 'Hide' : 'Show'} Test Accounts
              </Button>
              
              {showDevInfo && (
                <Alert className="mt-3 border-blue-600 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <div className="text-sm">
                      <p className="font-medium mb-2">Test Accounts:</p>
                      
                      <div className="mb-2 p-2 bg-white rounded border">
                        <div className="font-medium">👔 Executive Account</div>
                        <div>Email: <span className="font-mono text-xs">admin@rotaract.muj</span></div>
                        <div>Password: <span className="font-mono text-xs">RotaractMUJ@2024</span></div>
                        <Button
                          onClick={() => setFormData({ email: 'admin@rotaract.muj', password: 'RotaractMUJ@2024' })}
                          size="sm"
                          variant="outline"
                          className="mt-1 h-6 text-xs"
                        >
                          Use This Account
                        </Button>
                      </div>
                      
                      <div className="mb-2 p-2 bg-white rounded border">
                        <div className="font-medium">🎓 Student Account</div>
                        <div>Email: <span className="font-mono text-xs">student@rotaract.muj</span></div>
                        <div>Password: <span className="font-mono text-xs">Student@2024</span></div>
                        <div>Name: <span className="text-xs">Arjun Kumar (CSD Domain)</span></div>
                        <Button
                          onClick={() => setFormData({ email: 'student@rotaract.muj', password: 'Student@2024' })}
                          size="sm"
                          variant="outline"
                          className="mt-1 h-6 text-xs"
                        >
                          Use This Account
                        </Button>
                      </div>
                      
                      <p className="text-xs mt-2 text-blue-600">
                        🔥 Real Firebase Authentication Active
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
