const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const csv = require('csv-parser');

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

// Default password for executives (they can change it later)
const DEFAULT_PASSWORD = "RotaractMUJ@2024!";

async function createExecutiveAccount(executiveData) {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      executiveData.email,
      DEFAULT_PASSWORD
    );

    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      fullName: executiveData.fullName,
      email: executiveData.email,
      phoneNumber: executiveData.phoneNumber,
      registrationNumber: executiveData.registrationNumber,
      position: executiveData.position,
      domain: executiveData.domain,
      role: 'executive',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    console.log(`✅ Created executive account for: ${executiveData.fullName} (${executiveData.position})`);
    console.log(`   Email: ${executiveData.email}`);
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
    console.log(`   UID: ${user.uid}`);
    console.log('---');

    return { success: true, uid: user.uid };
  } catch (error) {
    console.error(`❌ Failed to create account for ${executiveData.fullName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function createAllExecutives() {
  const executives = [];
  
  // Read CSV file
  return new Promise((resolve, reject) => {
    fs.createReadStream('executives-template.csv')
      .pipe(csv())
      .on('data', (row) => executives.push(row))
      .on('end', async () => {
        console.log(`📋 Found ${executives.length} executives to create`);
        console.log('🚀 Starting account creation...\n');

        const results = [];
        
        for (const executive of executives) {
          const result = await createExecutiveAccount(executive);
          results.push({ ...executive, ...result });
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Summary
        console.log('\n📊 SUMMARY:');
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(`✅ Successful: ${successful}`);
        console.log(`❌ Failed: ${failed}`);
        
        if (failed > 0) {
          console.log('\n❌ Failed accounts:');
          results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.fullName}: ${r.error}`);
          });
        }

        console.log('\n🔐 Default password for all accounts: ' + DEFAULT_PASSWORD);
        console.log('📧 Executives should change their password on first login');
        
        resolve(results);
      })
      .on('error', reject);
  });
}

// Run the script
if (require.main === module) {
  createAllExecutives()
    .then(() => {
      console.log('\n🎉 Executive account creation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { createExecutiveAccount, createAllExecutives };
