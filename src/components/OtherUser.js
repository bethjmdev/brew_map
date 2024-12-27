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
  const { uidName } = useParams(); // Extract user identifier from the URL
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [brewBadge, setBrewBadge] = useState(null);

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
