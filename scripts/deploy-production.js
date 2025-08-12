// Production Deployment Script for Rotaract Club MUJ
// This script handles the complete production deployment process

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Production Deployment for Rotaract Club MUJ...\n');

// Production deployment steps
const deploymentSteps = [
  {
    name: 'Build Production Bundle',
    command: 'npm run build',
    description: 'Creating optimized production build'
  },
  {
    name: 'Deploy Firebase Security Rules',
    command: 'firebase deploy --only firestore:rules',
    description: 'Deploying production security rules'
  },
  {
    name: 'Deploy Firebase Indexes',
    command: 'firebase deploy --only firestore:indexes',
    description: 'Deploying database indexes for performance'
  },
  {
    name: 'Deploy Storage Rules',
    command: 'firebase deploy --only storage',
    description: 'Deploying secure storage rules'
  },
  {
    name: 'Deploy Hosting',
    command: 'firebase deploy --only hosting',
    description: 'Deploying the web application'
  }
];

async function runDeployment() {
  let successCount = 0;
  let errorCount = 0;
  
  for (const step of deploymentSteps) {
    try {
      console.log(`📋 Step: ${step.name}`);
      console.log(`📝 Description: ${step.description}`);
      console.log(`⚡ Executing: ${step.command}\n`);
      
      execSync(step.command, { stdio: 'inherit' });
      
      console.log(`✅ ${step.name} completed successfully!\n`);
      successCount++;
      
      // Add delay between steps to avoid rate limiting
      if (step.name !== deploymentSteps[deploymentSteps.length - 1].name) {
        console.log('⏳ Waiting 5 seconds before next step...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
    } catch (error) {
      console.error(`❌ Error in ${step.name}:`, error.message);
      console.log(`🔄 Continuing with next step...\n`);
      errorCount++;
    }
  }
  
  // Deployment summary
  console.log('🎉 Production Deployment Summary:');
  console.log(`✅ Successful steps: ${successCount}`);
  console.log(`❌ Failed steps: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n🎊 All deployment steps completed successfully!');
    console.log('🌐 Your application is now live in production!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test the production application');
    console.log('2. Create bulk users using the user creation script');
    console.log('3. Send welcome emails to all users');
    console.log('4. Monitor application performance');
  } else {
    console.log('\n⚠️  Some deployment steps failed. Please review the errors above.');
    console.log('🔄 You can re-run individual steps using:');
    console.log('   firebase deploy --only [service]');
  }
}

// Production environment checklist
function checkProductionReadiness() {
  console.log('🔍 Checking Production Readiness...\n');
  
  const checks = [
    {
      name: 'Firebase Project Configuration',
      check: () => fs.existsSync('.firebaserc'),
      message: '✅ Firebase project configured'
    },
    {
      name: 'Security Rules',
      check: () => fs.existsSync('firestore.rules'),
      message: '✅ Security rules configured'
    },
    {
      name: 'Database Indexes',
      check: () => fs.existsSync('firestore.indexes.json'),
      message: '✅ Database indexes configured'
    },
    {
      name: 'Storage Rules',
      check: () => fs.existsSync('storage.rules'),
      message: '✅ Storage rules configured'
    },
    {
      name: 'Environment Variables',
      check: () => {
        const envFile = '.env.production';
        if (fs.existsSync(envFile)) {
          const content = fs.readFileSync(envFile, 'utf8');
          return content.includes('VITE_FIREBASE_API_KEY') && 
                 content.includes('VITE_FIREBASE_PROJECT_ID');
        }
        return false;
      },
      message: '✅ Production environment variables configured'
    }
  ];
  
  let allChecksPassed = true;
  
  for (const check of checks) {
    if (check.check()) {
      console.log(check.message);
    } else {
      console.log(`❌ ${check.name} not configured`);
      allChecksPassed = false;
    }
  }
  
  console.log('');
  
  if (allChecksPassed) {
    console.log('🎯 All production checks passed! Ready to deploy.');
    return true;
  } else {
    console.log('⚠️  Some production checks failed. Please configure missing items before deployment.');
    return false;
  }
}

// Main execution
async function main() {
  try {
    // Check production readiness first
    const isReady = checkProductionReadiness();
    
    if (!isReady) {
      console.log('\n🛑 Production deployment aborted due to configuration issues.');
      process.exit(1);
    }
    
    // Confirm deployment
    console.log('🚀 Starting production deployment in 10 seconds...');
    console.log('Press Ctrl+C to cancel\n');
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Run deployment
    await runDeployment();
    
  } catch (error) {
    console.error('❌ Fatal deployment error:', error);
    process.exit(1);
  }
}

// Run the script
main();
