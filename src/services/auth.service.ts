import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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

class AuthService {
  private currentUser: UserProfile | null = null;

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      
      if (!userProfile.isActive) {
        await signOut(auth);
        throw new Error('Account is inactive. Please contact administrator.');
      }
      
      this.currentUser = userProfile;
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  }

  // Sign up new user (admin only)
  async signUp(
    email: string, 
    password: string, 
    userData: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (userData.fullName) {
        await updateProfile(userCredential.user, {
          displayName: userData.fullName
        });
      }

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        fullName: userData.fullName || '',
        role: userData.role || 'student',
        serviceHours: 0,
        registrationNumber: userData.registrationNumber,
        phone: userData.phone,
        domain: userData.domain,
        joinedAt: new Date(),
        isActive: true,
        profilePicture: userData.profilePicture
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
      this.currentUser = userProfile;
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
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
    return guestProfile;
  }

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
    this.currentUser = null;
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), updates);
      if (this.currentUser && this.currentUser.uid === uid) {
        this.currentUser = { ...this.currentUser, ...updates };
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Add service hours
  async addServiceHours(uid: string, hours: number): Promise<void> {
    try {
      const userProfile = await this.getUserProfile(uid);
      if (userProfile) {
        const newServiceHours = userProfile.serviceHours + hours;
        await this.updateUserProfile(uid, { serviceHours: newServiceHours });
      }
    } catch (error) {
      console.error('Error adding service hours:', error);
      throw new Error('Failed to add service hours');
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userProfile = await this.getUserProfile(user.uid);
        this.currentUser = userProfile;
        callback(userProfile);
      } else {
        this.currentUser = null;
        callback(null);
      }
    });
  }

  // Get current user
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
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
}

export const authService = new AuthService();
export default authService;
