import * as admin from 'firebase-admin';

const firebaseApp = admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  serviceAccountId: process.env.FIREBASE_CLIENT_EMAIL,
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as any),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export function getDatabase() {
  return admin.database();
}

export default firebaseApp;
