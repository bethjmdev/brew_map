// import React, { useEffect, useState } from "react";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../utils/auth/firebase";
// import CoffeeCups from "./pages/profile/CoffeeCups";

// import "./Profile.css";

// export const Profile = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const auth = getAuth();
//   const currentUser = auth.currentUser; // Get the current user
//   const [brewBadge, setBrewBadge] = useState(null); // Store brewBadge data
//   const [cafes, setCafes] = useState(0); // Individual state for cafes
//   const [photos, setPhotos] = useState(0); // Individual state for photos
//   const [reviewsBadge, setReviewsBadge] = useState(0); // Individual state for reviews

//   const cafeBadges = [
//     `Bean Scout`,
//     `Brew Pathfinder`,
//     `Espresso Explorer`,
//     `Caffeine Pioneer`,
//   ];

//   const photoBadges = [
//     `Caffeine Shutterbug`, // 1-4
//     `Snapshot Sipper`, // 5-14
//     `Latte Luminary`, // 15-24
//     `Brewtiful Visionary`, // 25+
//   ];

//   const reviewBadges = [
//     `Percolating Critic`, // 1-4
//     `Grounded Reviewer`, // 5-9
//     `Brewmaster Critic`, // 10-19
//     `Cupping Connoisseur`, // 20+
//   ];

//   const getCafeBadge = (cafes) => {
//     if (cafes === 0) {
//       return null; // No badge if cafes is 0
//     } else if (cafes >= 1 && cafes < 5) {
//       return cafeBadges[0]; // Bean Scout
//     } else if (cafes >= 5 && cafes < 10) {
//       return cafeBadges[1]; // Brew Pathfinder
//     } else if (cafes >= 10 && cafes < 20) {
//       return cafeBadges[2]; // Espresso Explorer
//     } else if (cafes >= 20) {
//       return cafeBadges[3]; // Caffeine Pioneer
//     }
//     return null;
//   };

//   const getPhotoBadge = (photos) => {
//     let badge = null;

//     switch (true) {
//       case photos >= 1 && photos < 5:
//         badge = photoBadges[0]; // Coffee Photographer
//         break;
//       case photos >= 5 && photos < 15:
//         badge = photoBadges[1]; // Snapshot Sipper
//         break;
//       case photos >= 15 && photos < 25:
//         badge = photoBadges[2]; // Latte Lens
//         break;
//       case photos >= 25:
//         badge = photoBadges[3]; // Coffee Cameraman
//         break;
//       default:
//         badge = null; // No badge
//     }

//     return badge;
//   };

//   const getReviewBadge = (reviews) => {
//     let badge = null;

//     switch (true) {
//       case reviews >= 1 && reviews < 5:
//         badge = reviewBadges[0]; // Percolating Critic
//         break;
//       case reviews >= 5 && reviews < 10:
//         badge = reviewBadges[1]; // Grounded Reviewer
//         break;
//       case reviews >= 10 && reviews < 20:
//         badge = reviewBadges[2]; // Brewmaster Critic
//         break;
//       case reviews >= 20:
//         badge = reviewBadges[3]; // Espresso Connoisseur
//         break;
//       default:
//         badge = null; // No badge
//     }

//     return badge;
//   };

//   // const copyFollowLink = () => {
//   //   if (!currentUser || !profileData) return;

//   //   // Generate the follow link using the format
//   //   const lastFourDigits = currentUser.uid.slice(-4);
//   //   const userName = profileData.firstName + profileData.lastName; // Adjust this based on your name field
//   //   const followLink = `${window.location.origin}/otheruser/${lastFourDigits}-${userName}`;

//   //   // Copy the link to the clipboard
//   //   navigator.clipboard
//   //     .writeText(followLink)
//   //     .then(() => {
//   //       alert("Follow link copied to clipboard!");
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error copying link:", error);
//   //     });
//   // };

//   const copyFollowLink = () => {
//     if (!currentUser || !profileData) return;

//     // Generate the follow link using the full userId in a query parameter
//     const lastFourDigits = currentUser.uid.slice(-4);
//     const userName = profileData.firstName + profileData.lastName; // Adjust this based on your name field
//     const followLink = `${window.location.origin}/otheruser/${lastFourDigits}-${userName}?uid=${currentUser.uid}`;

//     // Copy the link to the clipboard
//     navigator.clipboard
//       .writeText(followLink)
//       .then(() => {
//         alert("Follow link copied to clipboard!");
//       })
//       .catch((error) => {
//         console.error("Error copying link:", error);
//       });
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (currentUser) {
//         try {
//           const userDoc = await getDoc(doc(db, "BrewUsers", currentUser.uid));
//           if (userDoc.exists()) {
//             setProfileData(userDoc.data());
//           } else {
//             console.log("No such document!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }

//       if (currentUser) {
//         try {
//           // Query Firestore to find the document where `id` matches `currentUser.uid`
//           const q = query(
//             collection(db, "BrewBadges"),
//             where("id", "==", currentUser.uid)
//           );
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             // Get the first matching document
//             querySnapshot.forEach((doc) => {
//               console.log("Document Data:", doc.data());
//               setBrewBadge(doc.data());
//             });
//           } else {
//             console.log(currentUser.uid, "No matching brewbadge found!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };

//     fetchUserData();
//   }, [currentUser]);

//   useEffect(() => {
//     if (brewBadge) {
//       // Update each field's state separately
//       setCafes(brewBadge.cafes || 0);
//       setPhotos(brewBadge.photos || 0);
//       setReviewsBadge(brewBadge.reviews || 0);
//     }
//   }, [brewBadge]);

//   useEffect(() => {
//     const readUserReviews = async () => {
//       if (!currentUser) return;

//       const reviewRef = collection(db, "ShopReviews");
//       const q = query(
//         reviewRef,
//         where("userID_submitting", "==", currentUser.uid)
//       );

//       try {
//         const querySnapshot = await getDocs(q);
//         const reviewList = [];

//         querySnapshot.forEach((doc) => {
//           reviewList.push({ id: doc.id, ...doc.data() });
//         });

//         setReviews(reviewList);
//       } catch (error) {
//         console.error("Error fetching user reviews:", error);
//       }
//     };

//     readUserReviews();
//   }, [currentUser]);

//   return (
//     <div className="profile">
//       <div className="profile-container">
//         {profileData ? (
//           <div>
//             <h2>
//               <strong>
//                 {profileData.firstName} {profileData.lastName}{" "}
//               </strong>
//             </h2>
//             <button onClick={copyFollowLink}>Copy Follow Link</button>

//             <p>
//               <strong>Favorite Cafe Drink:</strong> A {profileData.cafeTemp}{" "}
//               {profileData.cafeMilk}{" "}
//               {profileData.cafeMilk !== "Black" && "Milk"}{" "}
//               {profileData.cafeDrink}
//             </p>

//             <p>
//               <strong>Favorite at Home Drink:</strong> A {profileData.homeTemp}{" "}
//               {profileData.homeDrink} {profileData.homeMilk}{" "}
//               {profileData.homeMilk !== "Black" && "Milk"}{" "}
//             </p>
//             <p>
//               {profileData.firstName}'s favorite cafe is {profileData.favCafe}{" "}
//               and preferred roast is {profileData.selectedRoast}.
//             </p>
//             <p>{profileData.about}</p>
//           </div>
//         ) : (
//           <p>Loading profile...</p>
//         )}

//         <h2>Badges</h2>
//         <div>
//           {/* <p>
//             {[
//               getCafeBadge(cafes),
//               getPhotoBadge(photos),
//               getReviewBadge(reviewsBadge),
//             ]
//               .filter(Boolean) // Remove empty or null values
//               .join(", ")}
//           </p> */}

//           <p>
//             {[
//               getCafeBadge(cafes),
//               getPhotoBadge(photos),
//               getReviewBadge(reviewsBadge),
//             ]
//               .filter(Boolean) // Remove empty or null values
//               .join(", ") ||
//               "No badges yet! Leave a review for a shop, add a coffee shop, or upload a photo to a review earn a badge."}
//           </p>
//         </div>

//         <h2>Reviews Section</h2>
//         {reviews.length > 0 ? (
//           reviews.map((review) => (
//             <div key={review.id} className="review-section">
//               <strong>
//                 <h3>{review.shop_name}</h3>
//               </strong>
//               <p>
//                 Ordered a {review.selectedRoast} roast {review.selectedTemp}{" "}
//                 {review.selectedMilk}{" "}
//                 {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}{" "}
//                 that was {review.selectedProcess} processed{" "}
//                 {review.flavoring ? "with flavoring" : " "}
//               </p>

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
//               <p className="personal-review">
//                 <strong>Review:</strong> {review.review}
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

// export default Profile;

import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../utils/auth/firebase";
import CoffeeCups from "./pages/profile/CoffeeCups";

import "./Profile.css";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [brewBadge, setBrewBadge] = useState(null);

  const copyFollowLink = () => {
    if (!currentUser || !profileData) return;

    // Encode the userId using Base64
    const encodedUserId = btoa(currentUser.uid);
    const lastFourDigits = currentUser.uid.slice(-4);
    const userName = profileData.firstName + profileData.lastName;
    const followLink = `${window.location.origin}/otheruser/${lastFourDigits}-${userName}?uid=${encodedUserId}`;

    // Copy the link to the clipboard
    navigator.clipboard
      .writeText(followLink)
      .then(() => {
        alert("Follow link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying link:", error);
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "BrewUsers", currentUser.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      if (currentUser) {
        try {
          const q = query(
            collection(db, "BrewBadges"),
            where("id", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              setBrewBadge(doc.data());
            });
          } else {
            console.log("No matching brewbadge found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const readUserReviews = async () => {
      if (!currentUser) return;

      const reviewRef = collection(db, "ShopReviews");
      const q = query(
        reviewRef,
        where("userID_submitting", "==", currentUser.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const reviewList = [];
        querySnapshot.forEach((doc) => {
          reviewList.push({ id: doc.id, ...doc.data() });
        });

        setReviews(reviewList);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    readUserReviews();
  }, [currentUser]);

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
            <button onClick={copyFollowLink}>Copy Follow Link</button>
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
        <p>{brewBadge ? "Your badges are displayed here" : "No badges yet!"}</p>

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

export default Profile;
