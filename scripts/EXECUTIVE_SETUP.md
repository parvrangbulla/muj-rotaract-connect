# 🎯 Executive Account Setup Guide

This guide will help you create executive accounts for your Rotaract Club members.

## 📋 Prerequisites

1. **Firebase Project**: Ensure your Firebase project is set up and configured
2. **Node.js**: Install Node.js (version 16 or higher)
3. **Firebase CLI**: Install Firebase CLI globally
4. **Dependencies**: Install required npm packages

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies
```bash
cd scripts
npm install firebase csv-parser
```

### Step 2: Update Firebase Configuration
Edit `scripts/create-executives.js` and replace the placeholder Firebase config with your actual values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "muj-rotaract-club.firebaseapp.com",
  projectId: "muj-rotaract-club",
  storageBucket: "muj-rotaract-club.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

**To find your Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `muj-rotaract-club`
3. Click the gear icon ⚙️ → "Project settings"
4. Scroll down to "Your apps" section
5. Copy the config values

### Step 3: Update Executive Information
Edit `scripts/executives-template.csv` with actual executive details:

**Required Fields:**
- `fullName`: Full name of the executive
- `email`: Valid email address (will be used for login)
- `phoneNumber`: Phone number with country code
- `registrationNumber`: Student registration number
- `position`: Role in the club
- `domain`: CSD, CMD, ISD, or PDD

**Example:**
```csv
fullName,email,phoneNumber,registrationNumber,position,domain
"Kshitij Sharma","kshitij.sharma@muj.ac.in","+91 98765 43210","MUJ2024CS001","President","CSD"
```

### Step 4: Customize Default Password
Edit `scripts/create-executives.js` and change the default password:

```javascript
const DEFAULT_PASSWORD = "YourCustomPassword123!";
```

**Password Requirements:**
- At least 8 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Easy to remember but secure

### Step 5: Run the Script
```bash
cd scripts
node create-executives.js
```

## 📊 Expected Output

The script will show:
```
📋 Found 14 executives to create
🚀 Starting account creation...

✅ Created executive account for: Kshitij Sharma (President)
   Email: kshitij.sharma@muj.ac.in
   Password: YourCustomPassword123!
   UID: abc123def456...
---

📊 SUMMARY:
✅ Successful: 14
❌ Failed: 0

🔐 Default password for all accounts: YourCustomPassword123!
📧 Executives should change their password on first login

🎉 Executive account creation completed!
```

## 🔐 Account Details

### Default Login Credentials
- **Email**: As specified in the CSV
- **Password**: The default password you set
- **Role**: Executive (full access to all features)

### What Gets Created
1. **Firebase Authentication Account**: For login/logout
2. **Firestore User Profile**: With all executive details
3. **Role Assignment**: Executive privileges

## 📱 First Login Instructions for Executives

### Email Template to Send Executives:
```
Subject: Your Rotaract Club Executive Account

Hi [Executive Name],

Your executive account for Rotaract Club MUJ has been created!

Login Details:
🌐 Website: https://muj-rotaract-club.web.app
📧 Email: [their-email]
🔐 Password: [default-password]

Important:
✅ Change your password on first login
✅ Keep your credentials secure
✅ Contact admin if you have issues

Best regards,
Rotaract Club MUJ Team
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Permission denied"**
   - Check Firebase Security Rules
   - Ensure you're authenticated as admin

2. **"Invalid email"**
   - Verify email format in CSV
   - Check for extra spaces

3. **"Password too weak"**
   - Ensure password meets Firebase requirements
   - Use mix of characters

4. **"Rate limit exceeded"**
   - Script includes 1-second delays
   - Wait and retry if needed

### Security Rules Check
Ensure your `firestore.rules` allow user creation:

```javascript
match /users/{userId} {
  allow create: if request.auth != null && request.auth.uid == userId;
  allow read, update: if request.auth != null && request.auth.uid == userId;
}
```

## 🔄 Updating Existing Executives

To add new executives later:
1. Add new rows to the CSV
2. Run the script again
3. Only new accounts will be created

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify all configuration values
3. Ensure proper permissions
4. Check network connectivity

---

**🎯 Goal**: Create 14 executive accounts with full access to event management, attendance tracking, and administrative features.

**⏱️ Estimated Time**: 5-10 minutes for setup, 2-3 minutes for execution
