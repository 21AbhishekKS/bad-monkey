# 🔥 Firebase Setup Guide for Bad Monkey E-commerce

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Name it: **"Bad Monkey Store"**
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

---

## Step 2: Enable Firebase Services

### A. Enable Firestore Database
1. In Firebase Console, go to **"Build" → "Firestore Database"**
2. Click **"Create Database"**
3. Select **"Start in test mode"** (for now)
4. Choose location: **asia-south1 (Mumbai)** or closest to India
5. Click **"Enable"**

### B. Enable Firebase Authentication
1. Go to **"Build" → "Authentication"**
2. Click **"Get Started"**
3. Click **"Email/Password"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

### C. Enable Firebase Storage
1. Go to **"Build" → "Storage"**
2. Click **"Get Started"**
3. Start in **"Test mode"**
4. Choose same location as Firestore
5. Click **"Done"**

---

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (⚙️ icon)
2. Scroll to **"Your apps"** section
3. Click **"Web" icon (</>)**
4. Register app nickname: **"Customer Website"**
5. Click **"Register App"**
6. Copy the `firebaseConfig` object - you'll need this!

```javascript
// Example firebaseConfig (yours will be different)
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "bad-monkey-store.firebaseapp.com",
  projectId: "bad-monkey-store",
  storageBucket: "bad-monkey-store.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

7. Repeat for **"Admin Dashboard"** (add another web app)

---

## Step 4: Create Admin User

1. Go to **"Authentication" → "Users"**
2. Click **"Add User"**
3. Email: `admin@badmonkey.com` (or your email)
4. Password: Create a strong password
5. Click **"Add User"**
6. **Save these credentials!** You'll need them to login to admin dashboard

---

## Step 5: Update Firebase Config in Code

### Customer Website:
Edit: `/app/customer-website/src/firebase/config.js`
```javascript
const firebaseConfig = {
  // Paste your config here
};
```

### Admin Dashboard:
Edit: `/app/admin-dashboard/src/firebase/config.js`
```javascript
const firebaseConfig = {
  // Paste your config here
};
```

---

## Step 6: Update Firestore Security Rules

Go to **Firestore Database → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read by everyone, write by authenticated users only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders - read/write by authenticated users only
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
      allow create: if true; // Allow customers to create orders
    }
    
    // Contacts - anyone can create, only auth users can read
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```

Click **"Publish"**

---

## Step 7: Update Storage Security Rules

Go to **Storage → Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **"Publish"**

---

## Step 8: Install Firebase CLI

```bash
npm install -g firebase-tools
```

---

## Step 9: Login to Firebase

```bash
firebase login
```

---

## Step 10: Deploy Customer Website

```bash
cd /app/customer-website
yarn build
firebase init hosting
# Select your project
# Public directory: build
# Single-page app: Yes
# GitHub deploys: No

firebase deploy --only hosting
```

Your site will be at: `https://bad-monkey-store.web.app`

---

## Step 11: Deploy Admin Dashboard

```bash
cd /app/admin-dashboard
yarn build
firebase init hosting
# Public directory: build
# Single-page app: Yes

firebase deploy --only hosting
```

Your admin will be at: `https://bad-monkey-store.web.app` (or create separate project)

---

## 🎯 Quick Checklist

- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Authentication enabled
- [ ] Storage enabled
- [ ] Admin user created
- [ ] Firebase config added to both websites
- [ ] Security rules updated
- [ ] Firebase CLI installed
- [ ] Both sites deployed

---

## 📱 UPI QR Code Setup

Edit `/app/customer-website/src/config/payment.js`:

```javascript
export const UPI_CONFIG = {
  upiId: 'badmonkey@paytm', // Your UPI ID
  merchantName: 'Bad Monkey',
  merchantCode: 'BADMONKEY'
};
```

---

## 🔐 Admin Login Credentials

**URL:** https://your-admin-site.web.app  
**Email:** admin@badmonkey.com  
**Password:** (the one you set in Step 4)

---

## 🚀 Done!

Your Firebase-powered e-commerce is ready!