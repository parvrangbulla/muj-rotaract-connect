
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Calendar } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.username && formData.password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', formData.username);
      localStorage.setItem('userType', 'member');
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    }
  };

  const handleGuestAccess = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', 'guest');
    localStorage.setItem('userType', 'guest');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
              alt="Rotaract Club MUJ Logo" 
              className="h-20 w-20 object-contain rounded-full border-2 border-rotaract-orange/50 p-1"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-gray-400">Or</span>
                </div>
              </div>

              <Button 
                onClick={handleGuestAccess}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-white/10"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account? Contact your club administrator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
