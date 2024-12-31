// import React, { useEffect, useState } from "react";
// import {
//   // useParams,
//   useLocation,
// } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../utils/auth/firebase";

// const OtherUser = () => {
//   // const { uidName } = useParams(); // Extract user identifier from the URL
//   const location = useLocation();
//   const [profileData, setProfileData] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [brewBadge, setBrewBadge] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   // Get userId either from location state or query parameter
//   const stateUserId = location.state?.userId;
//   const searchParams = new URLSearchParams(location.search);
//   const encodedUserId = searchParams.get("uid");
//   const userId = stateUserId || (encodedUserId ? atob(encodedUserId) : null);

//   const cafeBadges = [
//     `Bean Scout`,
//     `Brew Pathfinder`,
//     `Espresso Explorer`,
//     `Caffeine Pioneer`,
//   ];

//   const photoBadges = [
//     `Caffeine Shutterbug`,
//     `Snapshot Sipper`,
//     `Latte Luminary`,
//     `Brewtiful Visionary`,
//   ];

//   const reviewBadges = [
//     `Percolating Critic`,
//     `Grounded Reviewer`,
//     `Brewmaster Critic`,
//     `Cupping Connoisseur`,
//   ];

//   const getCafeBadge = (cafes) => {
//     if (cafes >= 1 && cafes < 5) return cafeBadges[0];
//     if (cafes >= 5 && cafes < 10) return cafeBadges[1];
//     if (cafes >= 10 && cafes < 20) return cafeBadges[2];
//     if (cafes >= 20) return cafeBadges[3];
//     return null;
//   };

//   const getPhotoBadge = (photos) => {
//     if (photos >= 1 && photos < 5) return photoBadges[0];
//     if (photos >= 5 && photos < 15) return photoBadges[1];
//     if (photos >= 15 && photos < 25) return photoBadges[2];
//     if (photos >= 25) return photoBadges[3];
//     return null;
//   };

//   const getReviewBadge = (reviews) => {
//     if (reviews >= 1 && reviews < 5) return reviewBadges[0];
//     if (reviews >= 5 && reviews < 10) return reviewBadges[1];
//     if (reviews >= 10 && reviews < 20) return reviewBadges[2];
//     if (reviews >= 20) return reviewBadges[3];
//     return null;
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (userId) {
//         try {
//           const userDoc = await getDoc(doc(db, "BrewUsers", userId));
//           if (userDoc.exists()) {
//             setProfileData(userDoc.data());
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
//           </div>
//         ) : (
//           <p>Loading profile...</p>
//         )}

//         <h2>Badges</h2>
//         <p>
//           {brewBadge
//             ? [
//                 getCafeBadge(brewBadge.cafes),
//                 getPhotoBadge(brewBadge.photos),
//                 getReviewBadge(brewBadge.reviews),
//               ]
//                 .filter(Boolean)
//                 .join(", ") || "No badges yet!"
//             : "Loading badges..."}
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
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../utils/auth/firebase";

const OtherUser = () => {
  const { identifier } = useParams(); // Primary method: from route params
  const location = useLocation(); // Fallback for state-based navigation

  // Extract userId
  const [lastFourDigits, userName] = identifier?.split("-") || [];
  const encodedUserId = new URLSearchParams(location.search).get("uid");
  const fallbackUserId = location.state?.userId;
  const userId = encodedUserId
    ? atob(encodedUserId) // Decode UID from query parameter
    : fallbackUserId || null; // Use fallback state if present

  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [brewBadge, setBrewBadge] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const cafeBadges = [
    `Bean Scout`,
    `Brew Pathfinder`,
    `Espresso Explorer`,
    `Caffeine Pioneer`,
  ];

  const photoBadges = [
    `Caffeine Shutterbug`,
    `Snapshot Sipper`,
    `Latte Luminary`,
    `Brewtiful Visionary`,
  ];

  const reviewBadges = [
    `Percolating Critic`,
    `Grounded Reviewer`,
    `Brewmaster Critic`,
    `Cupping Connoisseur`,
  ];

  const getCafeBadge = (cafes) => {
    if (cafes >= 1 && cafes < 5) return cafeBadges[0];
    if (cafes >= 5 && cafes < 10) return cafeBadges[1];
    if (cafes >= 10 && cafes < 20) return cafeBadges[2];
    if (cafes >= 20) return cafeBadges[3];
    return null;
  };

  const getPhotoBadge = (photos) => {
    if (photos >= 1 && photos < 5) return photoBadges[0];
    if (photos >= 5 && photos < 15) return photoBadges[1];
    if (photos >= 15 && photos < 25) return photoBadges[2];
    if (photos >= 25) return photoBadges[3];
    return null;
  };

  const getReviewBadge = (reviews) => {
    if (reviews >= 1 && reviews < 5) return reviewBadges[0];
    if (reviews >= 5 && reviews < 10) return reviewBadges[1];
    if (reviews >= 10 && reviews < 20) return reviewBadges[2];
    if (reviews >= 20) return reviewBadges[3];
    return null;
  };

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "BrewUsers", userId));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          console.error("User not found for ID:", userId);
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
    };

    const fetchUserReviews = async () => {
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
    };

    fetchUserData();
    fetchUserReviews();
  }, [userId]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (currentUser) {
        try {
          const q = query(
            collection(db, "Friends"),
            where("id", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const friendsDoc = querySnapshot.docs[0];
            const friendsData = friendsDoc.data();

            if (friendsData.friends && friendsData.friends.includes(userId)) {
              setIsFollowing(true);
            }
          }
        } catch (error) {
          console.error("Error checking following status:", error);
        }
      }
    };

    checkFollowingStatus();
  }, [currentUser, userId]);

  const handleFollowToggle = async () => {
    if (currentUser) {
      try {
        const q = query(
          collection(db, "Friends"),
          where("id", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const friendsDocRef = querySnapshot.docs[0].ref;

          if (isFollowing) {
            // Unfollow logic: Remove the userId from the friends array
            await updateDoc(friendsDocRef, {
              friends: arrayRemove(userId),
            });
            setIsFollowing(false);
          } else {
            // Follow logic: Add the userId to the friends array
            await updateDoc(friendsDocRef, {
              friends: arrayUnion(userId),
            });
            setIsFollowing(true);
          }
        } else {
          console.error("Friends document not found for the current user.");
        }
      } catch (error) {
        console.error("Error updating following status:", error);
      }
    }
  };

  if (!userId) {
    return <p>Error: Invalid user identifier.</p>;
  }

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
            <button onClick={handleFollowToggle}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
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
        <p>
          {brewBadge
            ? [
                getCafeBadge(brewBadge.cafes),
                getPhotoBadge(brewBadge.photos),
                getReviewBadge(brewBadge.reviews),
              ]
                .filter(Boolean)
                .join(", ") || "No badges yet!"
            : "Loading badges..."}
        </p>

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
