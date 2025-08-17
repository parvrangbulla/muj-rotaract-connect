const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
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

async function createOrUpdateExecutiveAccount(executiveData) {
  try {
    let user = null;
    let isNewAccount = false;
    
    // Try to create new account first
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        executiveData.email,
        DEFAULT_PASSWORD
      );
      user = userCredential.user;
      isNewAccount = true;
      console.log(`✅ Created NEW account for: ${executiveData.fullName}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Account exists, try to sign in to get user info
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            executiveData.email,
            DEFAULT_PASSWORD
          );
          user = userCredential.user;
          console.log(`🔄 Account exists for: ${executiveData.fullName} - Updating profile`);
        } catch (signInError) {
          // Can't sign in with default password, account exists with different password
          console.log(`⚠️  Account exists for: ${executiveData.fullName} but can't access - Skipping`);
          return { success: false, error: 'Account exists with different password', skipped: true };
        }
      } else {
        throw error;
      }
    }

    // Create or update user profile in Firestore
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
      updatedAt: new Date()
    };

    // Check if profile already exists
    const existingProfile = await getDoc(doc(db, 'users', user.uid));
    if (existingProfile.exists()) {
      // Update existing profile
      userProfile.createdAt = existingProfile.data().createdAt;
      console.log(`   📝 Updated existing profile`);
    } else {
      // Set creation date for new profile
      userProfile.createdAt = new Date();
      console.log(`   📝 Created new profile`);
    }

    await setDoc(doc(db, 'users', user.uid), userProfile);

    console.log(`   📧 Email: ${executiveData.email}`);
    if (isNewAccount) {
      console.log(`   🔐 Password: ${DEFAULT_PASSWORD}`);
    } else {
      console.log(`   🔐 Password: Existing (not changed)`);
    }
    console.log(`   🆔 UID: ${user.uid}`);
    console.log('---');

    return { success: true, uid: user.uid, isNewAccount };

  } catch (error) {
    console.error(`❌ Failed to process account for ${executiveData.fullName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function createOrUpdateAllExecutives() {
  const executives = [];
  
  // Read CSV file
  return new Promise((resolve, reject) => {
    fs.createReadStream('executives-template.csv')
      .pipe(csv())
      .on('data', (row) => executives.push(row))
      .on('end', async () => {
        console.log(`📋 Found ${executives.length} executives to process`);
        console.log('🚀 Starting account creation/update...\n');

        const results = [];
        
        for (const executive of executives) {
          const result = await createOrUpdateExecutiveAccount(executive);
          results.push({ ...executive, ...result });
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Summary
        console.log('\n📊 SUMMARY:');
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success && !r.skipped).length;
        const skipped = results.filter(r => r.skipped).length;
        const newAccounts = results.filter(r => r.success && r.isNewAccount).length;
        const updatedAccounts = results.filter(r => r.success && !r.isNewAccount).length;
        
        console.log(`✅ Successful: ${successful}`);
        console.log(`🔄 New accounts created: ${newAccounts}`);
        console.log(`📝 Existing accounts updated: ${updatedAccounts}`);
        console.log(`⚠️  Skipped (existing with different password): ${skipped}`);
        console.log(`❌ Failed: ${failed}`);
        
        if (failed > 0) {
          console.log('\n❌ Failed accounts:');
          results.filter(r => !r.success && !r.skipped).forEach(r => {
            console.log(`   - ${r.fullName}: ${r.error}`);
          });
        }

        if (skipped > 0) {
          console.log('\n⚠️  Skipped accounts (need manual password reset):');
          results.filter(r => r.skipped).forEach(r => {
            console.log(`   - ${r.fullName}: ${r.email}`);
          });
        }

        console.log('\n🔐 Default password for new accounts: ' + DEFAULT_PASSWORD);
        console.log('📧 Executives should change their password on first login');
        
        resolve(results);
      })
      .on('error', reject);
  });
}

// Run the script
if (require.main === module) {
  createOrUpdateAllExecutives()
    .then(() => {
      console.log('\n🎉 Executive account processing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { createOrUpdateExecutiveAccount, createOrUpdateAllExecutives };
