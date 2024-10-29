// BookmarkButton.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bookmark, BookmarkCheck } from "lucide-react";
import "./BookmarkButton.css";

const BookmarkButton = ({ postId, user }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkBookmarkStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://mindscribe.praiseafk.tech/posts/${postId}/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (isMounted) {
          setIsBookmarked(response.data.isBookmarked);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        if (isMounted) {
          setError("Failed to load bookmark status");
          setLoading(false);
        }
      }
    };

    checkBookmarkStatus();

    return () => {
      isMounted = false;
    };
  }, [postId, user]);

  const handleBookmark = async () => {
    if (!user) return; // Prevent action if user is not authenticated

    setLoading(true);
    try {
      if (isBookmarked) {
        await axios.delete(
          `https://mindscribe.praiseafk.tech/posts/${postId}/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setIsBookmarked(false);
      } else {
        await axios.post(
          `https://mindscribe.praiseafk.tech/posts/${postId}/bookmarks`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      setError("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <button className="bookmark-button disabled">
        <Bookmark className="bookmark-icon loading" />
      </button>
    );
  }

  // Handle error state
  if (error) {
    return (
      <button className="bookmark-button disabled" title={error}>
        <Bookmark className="bookmark-icon error" />
      </button>
    );
  }

  return (
    <button
      onClick={handleBookmark}
      className={`bookmark-button ${!user ? "disabled" : ""} ${
        isBookmarked ? "bookmarked" : ""
      }`}
      disabled={!user || loading}
      title={
        !user
          ? "Login to bookmark"
          : isBookmarked
          ? "Remove bookmark"
          : "Add bookmark"
      }
    >
      {isBookmarked ? (
        <BookmarkCheck className="bookmark-icon bookmarked" />
      ) : (
        <Bookmark className="bookmark-icon" />
      )}
    </button>
  );
};

export default BookmarkButton;
