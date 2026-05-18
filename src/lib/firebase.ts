import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore, doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const REQUIRED_CONFIG_KEYS = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;

const hasPlaceholderConfig = REQUIRED_CONFIG_KEYS.some((key) => {
  const value = firebaseConfig[key];
  return typeof value !== 'string' || value.trim() === '' || value.includes('YOUR_');
});

export const isFirebaseConfigured = !hasPlaceholderConfig;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } catch (error) {
    console.error('Firebase initialization failed. Running without Firebase services.', error);
  }
} else {
  console.warn('Firebase configuration is incomplete. Running without Firebase services.');
}

export { app, auth, db };

export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  if (!db || !auth) {
    console.warn('Skipping exception throw because Firebase services are unavailable.');
    return;
  }

  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL: Test connection to Firestore
export async function testConnection() {
  if (!db) {
    console.warn('Skipping Firestore connection test because Firebase is not configured.');
    return false;
  }

  try {
    // We try to fetch a non-existent doc from server to verify rules/connectivity
    await getDocFromServer(doc(db, '_internal_', 'connection_test'));
    console.log('Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    } else if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
      // This is expected if rules deny access to _internal_ collection, but it means we ARE connected
      console.log('Firestore connection verified (Access Denied as expected).');
      return true;
    } else {
      console.error('Firestore connection error:', error);
    }
  }

  return false;
}

export const syncUser = async (user: User) => {
  if (!db) {
    console.warn('Skipping user sync because Firebase is not configured.');
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'user',
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
};
