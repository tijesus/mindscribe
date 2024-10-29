import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LikeButton.css";
import { BounceLoader } from "react-spinners";

const LikeButton = ({ postId, user }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `https://mindscribe.praiseafk.tech/posts/${postId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (isMounted) {
          setLikes(response.data.count);
          setLiked(response.data.isLikedByUser);
          console.log("Fetched likes:", response.data);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
        if (isMounted) {
          setError("Failed to load likes.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLikes();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleLike = async () => {
    if (!user) return; // Prevent action if user is not authenticated
    setLoading(true); // Show loading indicator
    try {
      if (liked) {
        console.log(`Disliking post...`);
        await axios.delete(
          `https://mindscribe.praiseafk.tech/posts/${postId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setLikes((prevLikes) => prevLikes - 1); // Update likes using previous state
        setLiked(false);
      } else {
        console.log("Liking post...");
        await axios.post(
          `https://mindscribe.praiseafk.tech/posts/${postId}/likes`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setLikes((prevLikes) => prevLikes + 1); // Update likes using previous state
        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking/disliking post:", error);
      setError("Failed to update likes."); // Handle error
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle loading or error states
  if (loading) {
    return (
      <div className="like-button">
        <button className="like-btn" disabled>
          <BounceLoader size='15'/>
        </button>
      </div>
    );
  }

  if (error) {
    console.log(`liked: ${liked}----likes: ${likes}`);
    return (
      <div className="like-button">
        <button className="like-btn" disabled>
          {error}
        </button>
      </div>
    );
  }

  return (
    <div className="like-button">
      <button
        onClick={handleLike}
        className={`like-btn ${liked ? "liked" : ""}`}
        disabled={!user}
      >
        👍 {likes} {likes === 1 ? "Like" : "Likes"}
      </button>
    </div>
  );
};

export default LikeButton;
