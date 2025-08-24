# Student Account Setup Guide

## 🎯 Overview

This guide will help you create login credentials for all Senior Working Team members of the Rotaract Club MUJ. These accounts will have **Student** role permissions (not Executive).

## ⚠️ Important Distinction

- **Executive Accounts**: Full administrative access (create events, manage attendance, etc.)
- **Student Accounts**: Limited access (register for events, manage profile, track service hours)

## 📋 Prerequisites

1. **Node.js** installed (v16 or higher)
2. **npm** package manager
3. **Firebase Admin access** (for the project)
4. **Student data** in CSV format

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
# Navigate to scripts directory
cd scripts

# Run the automated setup
./setup-students.sh
```

### Option 2: Manual Setup

```bash
# Navigate to scripts directory
cd scripts

# Install dependencies
npm install

# Run the student creation script
node create-students.js students.csv
```

## 📊 Student Data Format

The `students.csv` file contains the following columns:
- **Email Address**: Primary email for login
- **Full name**: Student's full name
- **Personal email id**: Alternative email
- **Role**: Always "Senior Working Team"
- **Registration number**: Student's registration number
- **Phone number**: Contact number
- **Domain**: Club domain (CSD, CMD, ISD, PDD, etc.)

## 🔐 Account Details

### Default Credentials
- **Password**: `RotaractMUJ@2024!`
- **Role**: `student` (not executive)
- **Access Level**: Limited permissions

### Student Permissions
✅ **Can do:**
- Register for events
- Manage personal profile
- Track service hours
- View event calendar
- Mark attendance (if enabled)

❌ **Cannot do:**
- Create/edit events
- Manage other users
- Access admin dashboard
- Modify event settings

## 📈 Expected Results

The script will process all students and provide a summary:
- ✅ **Created**: New accounts created
- 🔄 **Updated**: Existing accounts updated
- ⚠️ **Password Mismatch**: Accounts with different passwords
- ❌ **Errors**: Failed operations

## 🚨 Troubleshooting

### Common Issues

1. **"User already exists"**
   - Account will be updated with latest information
   - No action needed

2. **"Password mismatch"**
   - User has a different password
   - Manual password reset required
   - Contact the user to reset their password

3. **"Permission denied"**
   - Check Firebase security rules
   - Ensure you have admin access

### Error Resolution

```bash
# Check Firebase connection
firebase login

# Verify project access
firebase projects:list

# Check current project
firebase use
```

## 📱 After Setup

### For Students
1. Visit: https://rotaractmuj.in
2. Click "Login"
3. Use email from CSV + password: `RotaractMUJ@2024!`
4. Complete profile setup

### For Administrators
1. Monitor account creation in Firebase Console
2. Check for any failed operations
3. Assist students with login issues

## 🔒 Security Notes

- **Default Password**: All students start with the same password
- **Password Reset**: Students should change passwords after first login
- **Role Enforcement**: Students cannot access executive features
- **Data Privacy**: Personal information is stored securely in Firestore

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify Firebase configuration
3. Ensure CSV format is correct
4. Contact technical team for assistance

## 🎉 Success Indicators

- All students can login successfully
- Student role is correctly set to "student"
- Domain information is properly assigned
- Service hours tracking is enabled
- Event registration works correctly

---

**Built for Rotaract Club MUJ - Senior Working Team Setup** 🚀
