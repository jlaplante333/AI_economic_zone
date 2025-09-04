# Firebase Authentication Setup for Oakland AI

This guide will help you set up Firebase Authentication to replace the Resend email service.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter project name: `oakland-ai` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Configure Action URLs

1. In Authentication > Settings > General
2. Scroll down to "Authorized domains"
3. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `oaklandai.com`)

3. In Authentication > Settings > Templates
4. Configure "Email verification" template:
   - Action URL: `https://your-domain.com/auth/verify`
   - Subject: "Verify your Oakland AI account"
   - Customize message as needed

5. Configure "Password reset" template:
   - Action URL: `https://your-domain.com/auth/reset`
   - Subject: "Reset your Oakland AI password"
   - Customize message as needed

## Step 4: Get Firebase Config

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register app with name: "Oakland AI Web"
6. Copy the config object

## Step 5: Get Firebase Admin SDK

1. In Project settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. **Keep this file secure - never commit it to git**

## Step 6: Update Environment Variables

Update your `.env` file with the Firebase configuration:

```bash
# Firebase Configuration (Frontend)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin (Backend)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

## Step 7: Test the Setup

1. Start your backend: `npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Test signup flow:
   - Go to `/signup`
   - Create account with email/password
   - Check email for verification link
   - Click verification link
   - Should redirect to `/auth/verify` and verify email

4. Test forgot password flow:
   - Go to `/forgot-password`
   - Enter email address
   - Check email for reset link
   - Click reset link
   - Should redirect to `/auth/reset` and allow password reset

## Step 8: Production Deployment

1. Update Action URLs in Firebase Console to use your production domain
2. Add your production domain to authorized domains
3. Update environment variables in your production environment
4. Test all flows in production

## Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**
   - Check that all environment variables are set correctly
   - Ensure Firebase config matches your project

2. **"Invalid API key" error**
   - Verify API key in Firebase Console
   - Check that the key is for the correct project

3. **"Unauthorized domain" error**
   - Add your domain to authorized domains in Firebase Console
   - For localhost, ensure `localhost` is added

4. **"Service account not found" error**
   - Verify service account email and private key
   - Ensure the service account has proper permissions

5. **Email not sending**
   - Check Firebase Console > Authentication > Users
   - Verify email provider is enabled
   - Check Firebase Console > Functions for any errors

### Verification

- Check Firebase Console > Authentication > Users to see created users
- Check Firebase Console > Authentication > Sign-in method to ensure Email/Password is enabled
- Verify Action URLs are set correctly in templates

## Security Notes

- Never commit Firebase Admin private key to git
- Use environment variables for all sensitive configuration
- Firebase handles email verification and password reset securely
- All authentication is now handled by Firebase's secure infrastructure

## Migration from Resend

- ✅ Resend package removed
- ✅ Old email service deleted
- ✅ New Firebase auth routes added
- ✅ Database schema updated with `firebase_uid` field
- ✅ Existing user data preserved
- ✅ New signup/verification flow implemented
- ✅ New password reset flow implemented

## Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Verify all environment variables are set
3. Check browser console for client-side errors
4. Check backend logs for server-side errors
5. Ensure Firebase project is properly configured
