import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import csv from 'csv-parser';
import fs from 'fs';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAndxHboFwFy-X2Xk0OBNV7iBthunktmXg",
  authDomain: "muj-rotaract-club.firebaseapp.com",
  projectId: "muj-rotaract-club",
  storageBucket: "muj-rotaract-club.firebasestorage.app",
  messagingSenderId: "42382355113",
  appId: "1:42382355113:web:a21bc5b65df649c2f3d7b8",
  measurementId: "G-T2NN9ZFKWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default password for all students
const DEFAULT_PASSWORD = "RotaractMUJ@2024!";

// Function to create or update student account
async function createOrUpdateStudent(studentData) {
  try {
    console.log(`\n--- Processing: ${studentData.fullName} ---`);
    
    // Check if user already exists
    try {
      // Try to sign in with default password
      const userCredential = await signInWithEmailAndPassword(auth, studentData.email, DEFAULT_PASSWORD);
      console.log(`✅ User ${studentData.email} already exists, updating profile...`);
      
      // Update the user's profile in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        fullName: studentData.fullName,
        email: studentData.email,
        phoneNumber: studentData.phoneNumber,
        registrationNumber: studentData.registrationNumber,
        role: 'student', // Important: Set role as 'student', not 'executive'
        domain: studentData.domain,
        position: studentData.role,
        rotaryId: studentData.registrationNumber,
        totalServiceHours: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }, { merge: true });
      
      console.log(`✅ Profile updated for ${studentData.fullName}`);
      return { success: true, action: 'updated', email: studentData.email };
      
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        // User doesn't exist, create new account
        console.log(`🆕 Creating new account for ${studentData.email}...`);
        
        const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, DEFAULT_PASSWORD);
        
        // Create user profile in Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          fullName: studentData.fullName,
          email: studentData.email,
          phoneNumber: studentData.phoneNumber,
          registrationNumber: studentData.registrationNumber,
          role: 'student', // Important: Set role as 'student', not 'executive'
          domain: studentData.domain,
          position: studentData.role,
          rotaryId: studentData.registrationNumber,
          totalServiceHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        });
        
        console.log(`✅ Account created for ${studentData.fullName}`);
        return { success: true, action: 'created', email: studentData.email };
        
      } else if (signInError.code === 'auth/wrong-password') {
        // User exists but password is different
        console.log(`⚠️  User ${studentData.email} exists but password is different. Manual password reset required.`);
        return { success: false, action: 'password_mismatch', email: studentData.email, error: 'Password mismatch' };
        
      } else {
        console.log(`❌ Error signing in: ${signInError.code}`);
        return { success: false, action: 'error', email: studentData.email, error: signInError.code };
      }
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${studentData.email}:`, error);
    return { success: false, action: 'error', email: studentData.email, error: error.message };
  }
}

// Main function to process CSV and create accounts
async function createStudentAccounts() {
  try {
    console.log('🚀 Starting student account creation process...\n');
    
    const results = [];
    const csvFile = process.argv[2] || 'students.csv';
    
    if (!fs.existsSync(csvFile)) {
      console.error(`❌ CSV file not found: ${csvFile}`);
      console.log('Please provide the CSV file path as an argument: node create-students.js students.csv');
      return;
    }
    
    // Read CSV file
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (data) => {
        // Clean and format the data
        const studentData = {
          email: data['Email Address']?.trim(),
          fullName: data['Full name']?.trim(),
          phoneNumber: data['Phone number']?.trim(),
          role: data['Role']?.trim(),
          registrationNumber: data['Registration number']?.trim(),
          domain: data['Domain']?.trim()
        };
        
        // Validate required fields
        if (studentData.email && studentData.fullName && studentData.phoneNumber && studentData.registrationNumber) {
          results.push(studentData);
        } else {
          console.log(`⚠️  Skipping incomplete record: ${studentData.email || 'No email'}`);
        }
      })
      .on('end', async () => {
        console.log(`📊 Found ${results.length} valid student records to process\n`);
        
        const summary = {
          created: 0,
          updated: 0,
          password_mismatch: 0,
          errors: 0
        };
        
        // Process each student
        for (const studentData of results) {
          const result = await createOrUpdateStudent(studentData);
          
          if (result.success) {
            if (result.action === 'created') summary.created++;
            else if (result.action === 'updated') summary.updated++;
          } else {
            if (result.action === 'password_mismatch') summary.password_mismatch++;
            else summary.errors++;
          }
          
          // Small delay to avoid overwhelming Firebase
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Print summary
        console.log('\n📋 PROCESSING SUMMARY:');
        console.log('========================');
        console.log(`✅ Created: ${summary.created}`);
        console.log(`🔄 Updated: ${summary.updated}`);
        console.log(`⚠️  Password Mismatch: ${summary.password_mismatch}`);
        console.log(`❌ Errors: ${summary.errors}`);
        console.log(`📊 Total Processed: ${results.length}`);
        
        if (summary.password_mismatch > 0) {
          console.log('\n⚠️  NOTE: Some accounts exist with different passwords.');
          console.log('   These users will need to reset their passwords manually.');
        }
        
        console.log('\n🎯 STUDENT ACCOUNTS READY!');
        console.log('============================');
        console.log('📧 Email: Use the email addresses from the CSV');
        console.log('🔑 Password: RotaractMUJ@2024!');
        console.log('👤 Role: Student (not Executive)');
        console.log('🎯 Access: Can register for events, manage profile, track service hours');
        
      });
      
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
createStudentAccounts();
