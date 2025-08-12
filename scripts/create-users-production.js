// Production User Creation Script for Rotaract Club MUJ
// This script creates users in bulk for production deployment

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';
import csv from 'csv-parser';

// Firebase configuration - Use your current project
const firebaseConfig = {
  apiKey: "AIzaSyAndxHboFwFy-X2Xk0OBNV7iBthunktmXg",
  authDomain: "muj-rotaract-club.firebaseapp.com",
  projectId: "muj-rotaract-club",
  storageBucket: "muj-rotaract-club.firebasestorage.app",
  messagingSenderId: "42382355113",
  appId: "1:42382355113:web:a21bc5b65df649c2f3d7b8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default password for all users (they'll be forced to change on first login)
const DEFAULT_PASSWORD = "RotaractMUJ@2024";

// Sample data structure for bulk import
const sampleUsers = {
  executives: [
    {
      email: "president@rotaract.muj",
      fullName: "Rahul Sharma",
      role: "executive",
      domain: "Leadership",
      registrationNumber: "MUJ2023001",
      phone: "+91 9876543210",
      serviceHours: 0
    },
    {
      email: "vice-president@rotaract.muj", 
      fullName: "Priya Patel",
      role: "executive",
      domain: "Leadership",
      registrationNumber: "MUJ2023002",
      phone: "+91 9876543211",
      serviceHours: 0
    },
    {
      email: "secretary@rotaract.muj",
      fullName: "Amit Kumar",
      role: "executive", 
      domain: "Administration",
      registrationNumber: "MUJ2023003",
      phone: "+91 9876543212",
      serviceHours: 0
    }
  ],
  students: [
    {
      email: "student1@rotaract.muj",
      fullName: "Arjun Singh",
      role: "student",
      domain: "CSD",
      registrationNumber: "MUJ2023015",
      phone: "+91 9876543215",
      serviceHours: 0
    },
    {
      email: "student2@rotaract.muj",
      fullName: "Neha Gupta",
      role: "student",
      domain: "CSD", 
      registrationNumber: "MUJ2023016",
      phone: "+91 9876543216",
      serviceHours: 0
    }
  ]
};

async function createUserInAuth(email, password, fullName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: fullName });
    
    return user.uid;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User ${email} already exists, skipping...`);
      return null;
    }
    throw error;
  }
}

async function createUserProfile(uid, userData) {
  try {
    const userProfile = {
      uid,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      domain: userData.domain,
      registrationNumber: userData.registrationNumber,
      phone: userData.phone,
      serviceHours: userData.serviceHours || 0,
      joinedAt: new Date(),
      isActive: true,
      profilePicture: null,
      lastLogin: null,
      forcePasswordChange: true // Force password change on first login
    };
    
    await setDoc(doc(db, 'users', uid), userProfile);
    return true;
  } catch (error) {
    console.error(`❌ Error creating profile for ${userData.email}:`, error.message);
    return false;
  }
}

async function createBulkUsers() {
  console.log('🚀 Starting bulk user creation for production...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Create executives first
  console.log('👔 Creating Executive Users...');
  for (const executive of sampleUsers.executives) {
    try {
      console.log(`📧 Creating executive: ${executive.fullName} (${executive.email})`);
      
      const uid = await createUserInAuth(executive.email, DEFAULT_PASSWORD, executive.fullName);
      if (uid) {
        const profileCreated = await createUserProfile(uid, executive);
        if (profileCreated) {
          console.log(`✅ Executive created successfully: ${executive.fullName}`);
          successCount++;
        } else {
          errorCount++;
        }
      }
    } catch (error) {
      console.error(`❌ Error creating executive ${executive.email}:`, error.message);
      errorCount++;
    }
    console.log(''); // Empty line for readability
  }
  
  // Create students
  console.log('🎓 Creating Student Users...');
  for (const student of sampleUsers.students) {
    try {
      console.log(`📧 Creating student: ${student.fullName} (${student.email})`);
      
      const uid = await createUserInAuth(student.email, DEFAULT_PASSWORD, student.fullName);
      if (uid) {
        const profileCreated = await createUserProfile(uid, student);
        if (profileCreated) {
          console.log(`✅ Student created successfully: ${student.fullName}`);
          successCount++;
        } else {
          errorCount++;
        }
      }
    } catch (error) {
      console.error(`❌ Error creating student ${student.email}:`, error.message);
      errorCount++;
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('🎉 Bulk user creation completed!');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`❌ Errors: ${errorCount} users`);
  console.log(`🔑 Default password for all users: ${DEFAULT_PASSWORD}`);
  console.log('\n📋 Next Steps:');
  console.log('1. Send welcome emails to all users');
  console.log('2. Force password change on first login');
  console.log('3. Set up email verification');
  console.log('4. Configure password reset functionality');
}

// Function to create users from CSV file
async function createUsersFromCSV(csvFilePath) {
  const users = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push({
          email: row.email,
          fullName: row.fullName,
          role: row.role,
          domain: row.domain,
          registrationNumber: row.registrationNumber,
          phone: row.phone,
          serviceHours: parseInt(row.serviceHours) || 0
        });
      })
      .on('end', async () => {
        console.log(`📊 Found ${users.length} users in CSV file`);
        console.log('🚀 Starting CSV import...\n');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const user of users) {
          try {
            console.log(`📧 Creating user: ${user.fullName} (${user.email})`);
            
            const uid = await createUserInAuth(user.email, DEFAULT_PASSWORD, user.fullName);
            if (uid) {
              const profileCreated = await createUserProfile(uid, user);
              if (profileCreated) {
                console.log(`✅ User created successfully: ${user.fullName}`);
                successCount++;
              } else {
                errorCount++;
              }
            }
          } catch (error) {
            console.error(`❌ Error creating user ${user.email}:`, error.message);
            errorCount++;
          }
          console.log(''); // Empty line for readability
        }
        
        console.log('🎉 CSV import completed!');
        console.log(`✅ Successfully created: ${successCount} users`);
        console.log(`❌ Errors: ${errorCount} users`);
        
        resolve();
      })
      .on('error', reject);
  });
}

// Main execution
async function main() {
  try {
    // Check if CSV file is provided as command line argument
    const csvFile = process.argv[2];
    
    if (csvFile && fs.existsSync(csvFile)) {
      console.log(`📁 Using CSV file: ${csvFile}`);
      await createUsersFromCSV(csvFile);
    } else {
      console.log('📝 Using sample data (no CSV file provided)');
      await createBulkUsers();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
