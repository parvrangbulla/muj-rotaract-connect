import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

// Function to create student account with retry logic
async function createStudent(studentData, retryCount = 0) {
  try {
    console.log(`\n--- Processing: ${studentData.fullName} ---`);
    
    // Create new account directly
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
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User ${studentData.email} already exists, skipping...`);
      return { success: true, action: 'already_exists', email: studentData.email };
    } else if (error.code === 'auth/too-many-requests' && retryCount < 3) {
      console.log(`⏳ Rate limited, waiting 30 seconds before retry ${retryCount + 1}/3...`);
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      return createStudent(studentData, retryCount + 1);
    } else {
      console.error(`❌ Error creating account for ${studentData.email}:`, error.code);
      return { success: false, action: 'error', email: studentData.email, error: error.code };
    }
  }
}

// Main function to process CSV and create accounts
async function createStudentAccounts() {
  try {
    console.log('🚀 Starting student account creation process...\n');
    console.log('⚠️  Note: This process will take time due to Firebase rate limiting\n');
    
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
          already_exists: 0,
          errors: 0
        };
        
        // Process each student with longer delays
        for (let i = 0; i < results.length; i++) {
          const studentData = results[i];
          console.log(`\n📝 Progress: ${i + 1}/${results.length}`);
          
          const result = await createStudent(studentData);
          
          if (result.success) {
            if (result.action === 'created') summary.created++;
            else if (result.action === 'already_exists') summary.already_exists++;
          } else {
            summary.errors++;
          }
          
          // Longer delay between requests to avoid rate limiting
          if (i < results.length - 1) {
            console.log('⏳ Waiting 5 seconds before next request...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          }
        }
        
        // Print summary
        console.log('\n📋 PROCESSING SUMMARY:');
        console.log('========================');
        console.log(`✅ Created: ${summary.created}`);
        console.log(`⚠️  Already Exists: ${summary.already_exists}`);
        console.log(`❌ Errors: ${summary.errors}`);
        console.log(`📊 Total Processed: ${results.length}`);
        
        if (summary.created > 0) {
          console.log('\n🎯 STUDENT ACCOUNTS READY!');
          console.log('============================');
          console.log('📧 Email: Use the email addresses from the CSV');
          console.log('🔑 Password: RotaractMUJ@2024!');
          console.log('👤 Role: Student (not Executive)');
          console.log('🎯 Access: Can register for events, manage profile, track service hours');
        } else {
          console.log('\n⚠️  No accounts were created. Check the errors above.');
        }
        
      });
      
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
createStudentAccounts();
