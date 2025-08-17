# 🌐 Custom Domain Setup Guide for rotaractmuj.in

## ✅ **Current Status**
- ✅ Firebase hosting site created: `rotaractmuj-in`
- ✅ Site deployed to: `https://rotaractmuj-in.web.app`
- ✅ Main site deployed to: `https://muj-rotaract-club.web.app`

## 🔧 **Next Steps to Connect rotaractmuj.in**

### **Step 1: Firebase Console Setup**
1. Go to [Firebase Console - Hosting](https://console.firebase.google.com/project/muj-rotaract-club/hosting)
2. Click on the **"Custom domains"** tab
3. Click **"Add custom domain"**
4. Enter: `rotaractmuj.in`
5. Click **"Continue"**

### **Step 2: DNS Configuration**
Firebase will provide you with these DNS records to add to your domain registrar:

#### **Type A Records:**
```
151.101.1.195
151.101.65.195
```

#### **Type AAAA Records (IPv6):**
```
2a04:4e42::395
2a04:4e42:600::395
```

### **Step 3: Add DNS Records**
1. **Go to your domain registrar** (where you bought rotaractmuj.in)
2. **Find DNS management** or **DNS settings**
3. **Add the A and AAAA records** provided by Firebase
4. **Wait for DNS propagation** (can take up to 48 hours, usually 15-30 minutes)

### **Step 4: Verify Domain**
1. **Return to Firebase Console**
2. **Click "Verify"** once DNS records are added
3. **Wait for verification** (usually takes a few minutes)

### **Step 5: SSL Certificate**
1. Firebase will automatically provision an SSL certificate
2. This may take up to 24 hours
3. Your site will be accessible at `https://rotaractmuj.in`

## 🚀 **Deployment Commands**

After DNS setup, you can deploy updates using:

```bash
# Build the project
npm run build

# Deploy to all hosting targets
firebase deploy --only hosting
```

## 📱 **Current URLs**
- **Main Site**: https://muj-rotaract-club.web.app
- **Custom Domain Site**: https://rotaractmuj-in.web.app
- **Your Domain**: https://rotaractmuj.in (after DNS setup)

## 🔍 **Troubleshooting**

### **DNS Not Working?**
- Check if DNS records are correctly added
- Use [whatsmydns.net](https://whatsmydns.net) to check propagation
- Wait up to 48 hours for full propagation

### **SSL Certificate Issues?**
- SSL certificates are automatically provisioned
- Can take up to 24 hours after domain verification
- Check Firebase Console for status

### **Need Help?**
- Firebase Documentation: [Custom Domains](https://firebase.google.com/docs/hosting/custom-domain)
- Firebase Support: [Support Portal](https://firebase.google.com/support)

## 🎯 **Expected Result**
Once complete, your Rotaract Club website will be accessible at:
**https://rotaractmuj.in**

Your site will have:
- ✅ Custom domain branding
- ✅ Professional appearance
- ✅ SSL security
- ✅ Fast global CDN
- ✅ Automatic scaling
