import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, UserProfile } from '@/services/auth.service';
import { devAuthService } from '@/services/auth-dev.service';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<UserProfile>;
  signInAsGuest: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: boolean;
  isExecutive: boolean;
  isStudent: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine which auth service to use
  const isFirebaseConfigured = () => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    return apiKey && apiKey !== "your-api-key";
  };

  const currentAuthService = isFirebaseConfigured() ? authService : devAuthService;

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = currentAuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const userProfile = await currentAuthService.signIn(email, password);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      // Only available with Firebase
      if (!isFirebaseConfigured()) {
        throw new Error('Sign up only available with Firebase. Contact administrator.');
      }
      const userProfile = await authService.signUp(email, password, userData);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInAsGuest = async (): Promise<UserProfile> => {
    setLoading(true);
    try {
      const guestProfile = await currentAuthService.signInAsGuest();
      setUser(guestProfile);
      setLoading(false);
      return guestProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await currentAuthService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await currentAuthService.updateUserProfile(user.uid, updates);
    setUser({ ...user, ...updates });
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInAsGuest,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isExecutive: user?.role === 'executive',
    isStudent: user?.role === 'student',
    isGuest: user?.role === 'guest'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
