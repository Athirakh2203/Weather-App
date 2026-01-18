import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcE_ex2q-MVJ96U7lUzcZiP_rfo6hTRCE",
  authDomain: "skycast-36f03.firebaseapp.com",
  projectId: "skycast-36f03",
  storageBucket: "skycast-36f03.firebasestorage.app",
  messagingSenderId: "1038548256541",
  appId: "1:1038548256541:web:70bba5128ffd7d280c43f4",
  measurementId: "G-WQBBNZ8CXW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
