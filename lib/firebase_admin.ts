// import * as admin from 'firebase-admin'
import admin from 'firebase-admin'

if (admin.apps.length == 0) {
  const credential = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  }
  admin.initializeApp({
    credential: admin.credential.cert(credential)
  })
}
