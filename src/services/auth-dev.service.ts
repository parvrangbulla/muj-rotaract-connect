// Temporary development authentication service
// This will work without Firebase for immediate testing

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: 'student' | 'executive' | 'guest';
  profilePicture?: string;
  serviceHours: number;
  registrationNumber?: string;
  phone?: string;
  domain?: 'CSD' | 'CMD' | 'ISD' | 'PDD';
  joinedAt: Date;
  isActive: boolean;
}

// Demo users for development
const DEMO_USERS = [
  {
    email: 'admin@rotaract.muj',
    password: 'admin123',
    profile: {
      uid: 'exec-1',
      email: 'admin@rotaract.muj',
      fullName: 'Rotaract Executive',
      role: 'executive' as const,
      serviceHours: 50,
      joinedAt: new Date('2024-01-01'),
      isActive: true
    }
  },
  {
    email: 'president@rotaract.muj',
    password: 'president123',
    profile: {
      uid: 'exec-2',
      email: 'president@rotaract.muj',
      fullName: 'Club President',
      role: 'executive' as const,
      serviceHours: 100,
      joinedAt: new Date('2024-01-01'),
      isActive: true
    }
  },
  {
    email: 'student@rotaract.muj',
    password: 'student123',
    profile: {
      uid: 'student-1',
      email: 'student@rotaract.muj',
      fullName: 'John Doe',
      role: 'student' as const,
      serviceHours: 20,
      registrationNumber: 'MUJ2023001',
      phone: '+91 9876543210',
      domain: 'CSD' as const,
      joinedAt: new Date('2024-02-15'),
      isActive: true
    }
  }
];

class DevAuthService {
  private currentUser: UserProfile | null = null;
  private isFirebaseAvailable = false;

  constructor() {
    // Check if Firebase is properly configured
    this.checkFirebaseConfig();
    // Load user from localStorage if exists
    this.loadUserFromStorage();
  }

  private checkFirebaseConfig() {
    try {
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      this.isFirebaseAvailable = apiKey && apiKey !== "your-api-key";
      console.log('🔥 Firebase available:', this.isFirebaseAvailable);
    } catch (error) {
      this.isFirebaseAvailable = false;
    }
  }

  private loadUserFromStorage() {
    try {
      const savedUser = localStorage.getItem('devUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
  }

  private saveUserToStorage(user: UserProfile | null) {
    try {
      if (user) {
        localStorage.setItem('devUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('devUser');
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserProfile> {
    console.log('🔐 Attempting sign in with:', email);
    
    if (this.isFirebaseAvailable) {
      // TODO: Use actual Firebase auth when configured
      throw new Error('Firebase auth not implemented yet. Use development accounts.');
    }

    // Development mode - check demo users
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password. Try: admin@rotaract.muj / admin123');
    }

    this.currentUser = user.profile;
    this.saveUserToStorage(this.currentUser);
    
    console.log('✅ Signed in as:', this.currentUser.fullName, '(' + this.currentUser.role + ')');
    return this.currentUser;
  }

  // Guest access
  async signInAsGuest(): Promise<UserProfile> {
    const guestProfile: UserProfile = {
      uid: 'guest',
      email: 'guest@rotaract.muj',
      fullName: 'Guest User',
      role: 'guest',
      serviceHours: 0,
      joinedAt: new Date(),
      isActive: true
    };
    
    this.currentUser = guestProfile;
    this.saveUserToStorage(this.currentUser);
    console.log('👤 Signed in as guest');
    return guestProfile;
  }

  // Sign out
  async signOut(): Promise<void> {
    this.currentUser = null;
    this.saveUserToStorage(null);
    console.log('👋 Signed out');
  }

  // Get current user
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Auth state change listener (simplified for dev)
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Call immediately with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {};
  }

  // Check if user is executive
  isExecutive(): boolean {
    return this.currentUser?.role === 'executive';
  }

  // Check if user is student
  isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }

  // Check if user is guest
  isGuest(): boolean {
    return this.currentUser?.role === 'guest';
  }

  // Update user profile (simplified)
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (this.currentUser && this.currentUser.uid === uid) {
      this.currentUser = { ...this.currentUser, ...updates };
      this.saveUserToStorage(this.currentUser);
    }
  }

  // Add service hours
  async addServiceHours(uid: string, hours: number): Promise<void> {
    if (this.currentUser && this.currentUser.uid === uid) {
      this.currentUser.serviceHours += hours;
      this.saveUserToStorage(this.currentUser);
    }
  }

  // Get demo accounts info
  getDemoAccounts() {
    return DEMO_USERS.map(user => ({
      email: user.email,
      password: user.password,
      role: user.profile.role,
      name: user.profile.fullName
    }));
  }
}

export const devAuthService = new DevAuthService();
export default devAuthService;
