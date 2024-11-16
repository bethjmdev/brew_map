import { create } from "zustand";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Zustand store for user management
export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      return set({ currentUser: null, isLoading: false });
    }

    try {
      const docRef = doc(db, "LenderUsers", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      set({ currentUser: null, isLoading: false });
    }
  },
  // Firebase auth listener to track login/logout
  initAuthListener: () => {
    const auth = getAuth();

    // Ensure that Firebase Authentication persistence is set to local
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            set({ currentUser: user, isLoading: false });
          } else {
            set({ currentUser: null, isLoading: false });
          }
        });
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  },
}));
