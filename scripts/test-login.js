const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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

// Test account (using one that we know works)
const testAccount = {
  email: "vermakshitij2004@gmail.com",
  name: "KSHITIJ VERMA",
  password: "RotaractMUJ@2024!" // This should work
};

async function testLogin() {
  try {
    console.log('🧪 Testing Executive Account Login');
    console.log('==================================\n');
    
    console.log(`📧 Testing login for: ${testAccount.name}`);
    console.log(`📧 Email: ${testAccount.email}`);
    console.log(`🔐 Password: ${testAccount.password}`);
    console.log('');
    
    console.log('🔄 Attempting to sign in...');
    
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      testAccount.email, 
      testAccount.password
    );
    
    const user = userCredential.user;
    
    console.log('✅ Login successful!');
    console.log(`   🆔 UID: ${user.uid}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   📅 Last Sign In: ${user.metadata.lastSignInTime}`);
    console.log('');
    console.log('🎉 Executive account is working correctly!');
    console.log('   This account can now access all executive features.');
    
    return { success: true, user };
    
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('   - Check if the password is correct');
    console.log('   - Verify the account exists in Firebase');
    console.log('   - Check Firebase Authentication settings');
    
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testLogin()
    .then((result) => {
      if (result.success) {
        console.log('\n🎯 Ready to test on the website!');
        console.log('   Go to: https://muj-rotaract-club.web.app');
        console.log('   Use the credentials above to login');
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Test error:', error);
      process.exit(1);
    });
}

module.exports = { testLogin };
