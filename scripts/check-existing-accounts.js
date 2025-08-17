const { initializeApp } = require('firebase/app');
const { getAuth, listUsers } = require('firebase-admin/auth');
const { getFirestore, collection, getDocs } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

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

// Initialize Firebase Admin (for server-side operations)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "muj-rotaract-club"
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function checkExistingAccounts() {
  try {
    console.log('🔍 Checking existing Firebase Authentication accounts...\n');
    
    // List all users in Firebase Auth
    const listUsersResult = await auth.listUsers();
    
    if (listUsersResult.users.length === 0) {
      console.log('✅ No existing user accounts found in Firebase Authentication');
      return;
    }
    
    console.log(`📊 Found ${listUsersResult.users.length} existing user(s):\n`);
    
    listUsersResult.users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Display Name: ${user.displayName || 'Not set'}`);
      console.log(`   Created: ${user.metadata.creationTime}`);
      console.log(`   Last Sign In: ${user.metadata.lastSignInTime || 'Never'}`);
      console.log('---');
    });
    
    // Check Firestore users collection
    console.log('\n🔍 Checking Firestore users collection...\n');
    
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('✅ No user profiles found in Firestore');
    } else {
      console.log(`📊 Found ${usersSnapshot.size} user profile(s) in Firestore:\n`);
      
      usersSnapshot.forEach((doc, index) => {
        const userData = doc.data();
        console.log(`${index + 1}. UID: ${doc.id}`);
        console.log(`   Name: ${userData.fullName || 'Not set'}`);
        console.log(`   Email: ${userData.email || 'Not set'}`);
        console.log(`   Role: ${userData.role || 'Not set'}`);
        console.log(`   Position: ${userData.position || 'Not set'}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking existing accounts:', error.message);
  }
}

// Run the check
if (require.main === module) {
  checkExistingAccounts()
    .then(() => {
      console.log('\n🎉 Account check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { checkExistingAccounts };
