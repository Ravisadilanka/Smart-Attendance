import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth';
import { confirmPasswordReset as firebaseConfirmPasswordReset } from 'firebase/auth';
import { getDatabase} from 'firebase/database';
import { getStorage, ref, uploadBytes } from 'firebase/storage';


const app = initializeApp({
    apiKey: "AIzaSyBgPtFGlCpMvX592vF1O03EerD7ibI6bi4",
    authDomain: "smart-attendance-system-fb1ba.firebaseapp.com",
    databaseURL: "https://smart-attendance-system-fb1ba-default-rtdb.firebaseio.com",
    projectId: "smart-attendance-system-fb1ba",
    storageBucket: "smart-attendance-system-fb1ba.appspot.com",
    messagingSenderId: "981695684743",
    appId: "1:981695684743:web:e9d8e743533770c26e9822",
    measurementId: "G-RWMLE401VN"
});

const auth = getAuth();

const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

const signOut = async () => {
    // Implement sign-out logic here...
};

const getCurrentUser = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            resolve(user);
            unsubscribe();
        });
    });
};

const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

const confirmPasswordReset = async (oobCode, newPassword) => {
    try {
        // Implement confirmPasswordReset logic here...
        await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
    } catch (error) {
        console.error('Confirm password reset error:', error);
        throw error; // Re-throw the error or handle it as needed
    }
};

const db = getDatabase(app);
const storage = getStorage(app);


export { auth, signIn, signOut, getCurrentUser, resetPassword, confirmPasswordReset, db, storage, ref, uploadBytes };