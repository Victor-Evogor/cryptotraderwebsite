import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import private_key from "@/firebase_private_key.json"

const firebaseAdminConfig = {
  credential: cert({
    projectId: private_key.project_id,
    clientEmail: private_key.client_email,
    privateKey: private_key.private_key,
  }),
};

const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
const adminAuth = getAuth(adminApp);

export { adminAuth };
