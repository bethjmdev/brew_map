// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   query,
//   where,
//   getDocs,
//   collection,
// } from "firebase/firestore";
// import { db } from "../utils/auth/firebase";
// import CoffeeCups from "./pages/profile/CoffeeCups";
// import { getAuth } from "firebase/auth";
// import "./Profile.css";

// const OtherUser = () => {
//   const location = useLocation();
//   const { userId } = location.state || {}; // Retrieve the OtherUser's UID from state
//   const [profileData, setProfileData] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [brewBadge, setBrewBadge] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (userId) {
//         try {
//           const userDoc = await getDoc(doc(db, "BrewUsers", userId));
//           if (userDoc.exists()) {
//             setProfileData(userDoc.data());
//           } else {
//             console.log("No such user document!");
//           }

//           const q = query(
//             collection(db, "BrewBadges"),
//             where("id", "==", userId)
//           );
//           const querySnapshot = await getDocs(q);
//           querySnapshot.forEach((doc) => setBrewBadge(doc.data()));
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         console.log("No user ID provided in state!");
//       }
//     };

//     const fetchUserReviews = async () => {
//       if (userId) {
//         try {
//           const reviewRef = collection(db, "ShopReviews");
//           const q = query(reviewRef, where("userID_submitting", "==", userId));
//           const querySnapshot = await getDocs(q);

//           const reviewList = [];
//           querySnapshot.forEach((doc) =>
//             reviewList.push({ id: doc.id, ...doc.data() })
//           );
//           setReviews(reviewList);
//         } catch (error) {
//           console.error("Error fetching user reviews:", error);
//         }
//       }
//     };

//     fetchUserData();
//     fetchUserReviews();
//   }, [userId]);

//   useEffect(() => {
//     const checkFollowingStatus = async () => {
//       if (currentUser) {
//         try {
//           const q = query(
//             collection(db, "Friends"),
//             where("id", "==", currentUser.uid)
//           );
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             const friendsDoc = querySnapshot.docs[0];
//             const friendsData = friendsDoc.data();

//             if (friendsData.friends && friendsData.friends.includes(userId)) {
//               setIsFollowing(true);
//             }
//           }
//         } catch (error) {
//           console.error("Error checking following status:", error);
//         }
//       }
//     };

//     checkFollowingStatus();
//   }, [currentUser, userId]);

//   const handleFollowToggle = async () => {
//     if (currentUser) {
//       try {
//         const q = query(
//           collection(db, "Friends"),
//           where("id", "==", currentUser.uid)
//         );
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const friendsDocRef = querySnapshot.docs[0].ref;

//           if (isFollowing) {
//             // Unfollow logic: Remove the userId from the friends array
//             await updateDoc(friendsDocRef, {
//               friends: arrayRemove(userId),
//             });
//             setIsFollowing(false);
//           } else {
//             // Follow logic: Add the userId to the friends array
//             await updateDoc(friendsDocRef, {
//               friends: arrayUnion(userId),
//             });
//             setIsFollowing(true);
//           }
//         } else {
//           console.error("Friends document not found for the current user.");
//         }
//       } catch (error) {
//         console.error("Error updating following status:", error);
//       }
//     }
//   };

//   return (
//     <div className="profile">
//       <div className="profile-container">
//         {profileData ? (
//           <div>
//             <h2>
//               <strong>
//                 {profileData.firstName} {profileData.lastName}
//               </strong>
//             </h2>
//             <button onClick={handleFollowToggle}>
//               {isFollowing ? "Unfollow" : "Follow"}
//             </button>
//             <p>
//               <strong>Favorite Cafe Drink:</strong> A {profileData.cafeTemp}{" "}
//               {profileData.cafeMilk}{" "}
//               {profileData.cafeMilk !== "Black" && "Milk"}{" "}
//               {profileData.cafeDrink}
//             </p>
//             <p>{profileData.about}</p>
//           </div>
//         ) : (
//           <p>Loading profile...</p>
//         )}

//         <h2>Badges</h2>
//         <p>
//           {brewBadge
//             ? [
//                 brewBadge.cafes >= 1 && brewBadge.cafes < 5
//                   ? "Bean Scout"
//                   : null,
//                 brewBadge.photos >= 1 && brewBadge.photos < 5
//                   ? "Snapshot Sipper"
//                   : null,
//                 brewBadge.reviews >= 1 && brewBadge.reviews < 5
//                   ? "Percolating Critic"
//                   : null,
//               ]
//                 .filter(Boolean)
//                 .join(", ")
//             : "No badges yet!"}
//         </p>

//         <h2>Reviews</h2>
//         {reviews.length > 0 ? (
//           reviews.map((review) => (
//             <div key={review.id} className="review-section">
//               <h3>{review.shop_name}</h3>
//               <p>
//                 Ordered a {review.selectedTemp} {review.selectedMilk}{" "}
//                 {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}
//               </p>
//               <p>{review.review}</p>
//               <p className="ratings-profile">
//                 <strong>Drink Rating</strong>{" "}
//                 <CoffeeCups rating={review.drinkRating} maxCups={5} />
//               </p>
//               <p className="ratings-profile">
//                 <strong>Shop Rating</strong>{" "}
//                 <CoffeeCups rating={review.shopRating} maxCups={5} />
//               </p>
//               <p className="ratings-profile">
//                 <strong>Staff Rating</strong>{" "}
//                 <CoffeeCups rating={review.staffRating} maxCups={5} />
//               </p>
//             </div>
//           ))
//         ) : (
//           <p>No reviews found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OtherUser;

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../utils/auth/firebase";

const OtherUser = () => {
  const { uidName } = useParams(); // Extract the last 4 digits and name
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [brewBadge, setBrewBadge] = useState(null);

  // Decode the Base64-encoded UID from the query parameter
  const searchParams = new URLSearchParams(location.search);
  const encodedUserId = searchParams.get("uid");
  const userId = encodedUserId ? atob(encodedUserId) : null;

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, "BrewUsers", userId));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          } else {
            console.log("No such user document!");
          }

          const q = query(
            collection(db, "BrewBadges"),
            where("id", "==", userId)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => setBrewBadge(doc.data()));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchUserReviews = async () => {
      if (userId) {
        try {
          const reviewRef = collection(db, "ShopReviews");
          const q = query(reviewRef, where("userID_submitting", "==", userId));
          const querySnapshot = await getDocs(q);

          const reviewList = [];
          querySnapshot.forEach((doc) =>
            reviewList.push({ id: doc.id, ...doc.data() })
          );
          setReviews(reviewList);
        } catch (error) {
          console.error("Error fetching user reviews:", error);
        }
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, [userId]);

  return (
    <div className="profile">
      <div className="profile-container">
        {profileData ? (
          <div>
            <h2>
              <strong>
                {profileData.firstName} {profileData.lastName}
              </strong>
            </h2>
            <p>
              <strong>Favorite Cafe Drink:</strong> A {profileData.cafeTemp}{" "}
              {profileData.cafeMilk}{" "}
              {profileData.cafeMilk !== "Black" && "Milk"}{" "}
              {profileData.cafeDrink}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <h2>Badges</h2>
        <p>{brewBadge ? "Badges go here" : "No badges yet!"}</p>

        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-section">
              <h3>{review.shop_name}</h3>
              <p>
                Ordered a {review.selectedTemp} {review.selectedMilk}{" "}
                {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}
              </p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default OtherUser;
