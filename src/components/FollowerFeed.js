import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../utils/auth/firebase";
import "./FollowerFeed.css";

const FollowerFeed = () => {
  const [friends, setFriends] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Number of posts per page

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
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

            if (friendsData.friends && Array.isArray(friendsData.friends)) {
              setFriends(friendsData.friends);
            } else {
              console.log("No friends array found in the document.");
            }
          } else {
            console.log("No Friends document found for the current user.");
          }
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    fetchFriends();
  }, [currentUser]);

  useEffect(() => {
    const fetchFeedItems = async () => {
      if (friends.length > 0) {
        try {
          const reviewRef = collection(db, "ShopReviews");
          const shopsRef = collection(db, "CoffeeShops");
          const feedList = [];
          const now = new Date();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          for (const friendId of friends) {
            const reviewQuery = query(
              reviewRef,
              where("userID_submitting", "==", friendId)
            );
            const reviewSnapshot = await getDocs(reviewQuery);

            reviewSnapshot.forEach((doc) => {
              const reviewData = doc.data();
              if (
                reviewData.timestamp &&
                typeof reviewData.timestamp.toMillis === "function" &&
                reviewData.timestamp.toMillis() > thirtyDaysAgo.getTime()
              ) {
                feedList.push({
                  type: "review",
                  id: doc.id,
                  ...reviewData,
                });
              }
            });

            const shopQuery = query(
              shopsRef,
              where("userID_submitting", "==", friendId)
            );
            const shopSnapshot = await getDocs(shopQuery);

            shopSnapshot.forEach((doc) => {
              const shopData = doc.data();
              if (
                shopData.timestamp &&
                typeof shopData.timestamp.toMillis === "function" &&
                shopData.timestamp.toMillis() > thirtyDaysAgo.getTime()
              ) {
                feedList.push({
                  type: "shop",
                  id: doc.id,
                  ...shopData,
                });
              }
            });
          }

          feedList.sort(
            (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
          );
          setFeedItems(feedList);
        } catch (error) {
          console.error("Error fetching feed items:", error);
        }
      }
    };

    fetchFeedItems();
  }, [friends]);

  const handleUserClick = (userId, userName) => {
    navigate(`/otheruser/${userId.slice(-4)}-${userName}`, {
      state: { userId },
    });
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = feedItems.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(feedItems.length / postsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="follower-feed">
      <h2>Friends' Activity (Last 30 Days)</h2>
      {currentPosts.length > 0 ? (
        currentPosts.map((item) => (
          <div key={item.id} className={`feed-item ${item.type}-item`}>
            {item.type === "review" ? (
              <div className="review-section">
                <h3 className="shop-name">{item.shop_name}</h3>
                <p>
                  Reviewed by:{" "}
                  <strong
                    onClick={() =>
                      handleUserClick(
                        item.userID_submitting,
                        item.user_name_submitting
                      )
                    }
                    style={{
                      cursor: "pointer",
                      color: "black",
                      textDecoration: "underline",
                      fontStyle: "italic",
                    }}
                  >
                    {item.user_name_submitting}
                  </strong>
                </p>
                <p>
                  Ordered a {item.selectedTemp} {item.selectedMilk}{" "}
                  {item.selectedMilk !== "Black" && "Milk"} {item.selectedBev}
                </p>
                <p className="personal-review">{item.review}</p>
                <div className="ratings">
                  <p>
                    <strong>Drink Rating:</strong> {item.drinkRating}/5
                  </p>
                  <p>
                    <strong>Shop Rating:</strong> {item.shopRating}/5
                  </p>
                  <p>
                    <strong>Staff Rating:</strong> {item.staffRating}/5
                  </p>
                </div>
              </div>
            ) : (
              <div className="shop-section">
                <h3 className="shop-name">{item.shop_name}</h3>
                <p>
                  Submitted by:{" "}
                  <strong
                    onClick={() =>
                      handleUserClick(
                        item.userID_submitting,
                        item.user_name_submitting
                      )
                    }
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {item.user_name_submitting}
                  </strong>
                </p>
                <p>
                  <strong>Address:</strong> {item.street_address}, {item.city},{" "}
                  {item.state}
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.website}
                  </a>
                </p>
              </div>
            )}
            <p className="timestamp">
              <small>
                {item.type === "review" ? "Reviewed on: " : "Added on: "}
                {new Date(item.timestamp.toMillis()).toLocaleString()}
              </small>
            </p>
          </div>
        ))
      ) : (
        <p>No activity found from your friends in the last 30 days.</p>
      )}

      {/* Pagination Controls */}
      {feedItems.length > postsPerPage && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowerFeed;
