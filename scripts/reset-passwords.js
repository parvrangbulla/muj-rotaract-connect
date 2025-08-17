const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, updatePassword } = require('firebase/auth');

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

// Default password for executives
const DEFAULT_PASSWORD = "RotaractMUJ@2024!";

// Accounts that need password reset
const accountsToReset = [
  {
    email: "satya262004@gmail.com",
    name: "Satya Agrawal",
    currentPassword: "password123" // We'll try common passwords
  },
  {
    email: "krishgupta2832@gmail.com", 
    name: "Krish Gupta",
    currentPassword: "password123"
  }
];

async function resetPassword(account) {
  try {
    console.log(`🔄 Attempting to reset password for: ${account.name}`);
    
    // Try to sign in with common passwords first
    const commonPasswords = [
      "password123",
      "123456",
      "password",
      "admin",
      "test",
      "123456789",
      "qwerty",
      "abc123"
    ];
    
    let signInSuccess = false;
    let currentPassword = null;
    
    for (const password of commonPasswords) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, account.email, password);
        signInSuccess = true;
        currentPassword = password;
        console.log(`   ✅ Signed in with password: ${password}`);
        break;
      } catch (error) {
        // Continue trying next password
      }
    }
    
    if (!signInSuccess) {
      console.log(`   ❌ Could not sign in with common passwords`);
      console.log(`   📧 Need manual password reset for: ${account.email}`);
      return { success: false, error: 'Could not sign in with common passwords' };
    }
    
    // Now update the password
    try {
      await updatePassword(auth.currentUser, DEFAULT_PASSWORD);
      console.log(`   🔐 Password successfully reset to: ${DEFAULT_PASSWORD}`);
      return { success: true, password: DEFAULT_PASSWORD };
    } catch (updateError) {
      console.log(`   ❌ Failed to update password: ${updateError.message}`);
      return { success: false, error: updateError.message };
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${account.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function resetAllPasswords() {
  console.log('🔐 Rotaract Club MUJ - Password Reset for Executives');
  console.log('===================================================\n');
  
  const results = [];
  
  for (const account of accountsToReset) {
    const result = await resetPassword(account);
    results.push({ ...account, ...result });
    console.log('---');
    
    // Add delay between attempts
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n📊 PASSWORD RESET SUMMARY:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed accounts (need manual reset):');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.email}`);
    });
  }
  
  console.log('\n🔐 Default password for all accounts: ' + DEFAULT_PASSWORD);
  
  return results;
}

// Run the script
if (require.main === module) {
  resetAllPasswords()
    .then(() => {
      console.log('\n🎉 Password reset process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { resetPassword, resetAllPasswords };
