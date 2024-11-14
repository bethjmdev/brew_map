// import { doc, getDoc } from "firebase/firestore";
// import { create } from "zustand";
// import { db } from "../utils/firebase";
// //contains all current user info
// export const useUserStore = create((set) => ({
//   currentUser: null,
//   isLoading: true,
//   fetchUserInfo: async (uid) => {
//     if (!uid) {
//       return set({ currentUser: null, isLoading: false });
//     }

//     try {
//       const docRef = doc(db, "LenderUsers", uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         set({ currentUser: docSnap.data(), isLoading: false });
//         // console.log("try if");
//       } else {
//         set({ currentUser: null, isLoading: false });
//         // console.log("try else");
//       }
//     } catch (err) {
//       console.log(err);
//       return set({ currentUser: null, isLoading: false });
//     }
//   },
// }));

import { create } from "zustand";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ currentUser: user, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    });
  },
}));
