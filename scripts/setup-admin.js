// Setup script to create initial executive user
// Run this after Firebase setup is complete

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config (replace with actual values)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "muj-rotaract-club.firebaseapp.com",
  projectId: "muj-rotaract-club",
  storageBucket: "muj-rotaract-club.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createExecutiveUser() {
  try {
    // Executive user details
    const email = "admin@rotaract.muj"; // Change this
    const password = "RotaractMUJ@2024"; // Change this
    const fullName = "Rotaract MUJ Executive";
    
    console.log('Creating executive user...');
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: fullName
    });
    
    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      role: 'executive',
      serviceHours: 0,
      joinedAt: new Date(),
      isActive: true
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    console.log('✅ Executive user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('⚠️  Please change the password after first login');
    
  } catch (error) {
    console.error('❌ Error creating executive user:', error.message);
  }
}

createExecutiveUser();
