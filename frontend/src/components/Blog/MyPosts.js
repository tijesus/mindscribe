import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import apiEngine from "../../api/requests";
import { BarLoader, ClipLoader } from "react-spinners";

const MyPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    currPageTotal: 0,
  });

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchMyPosts = useCallback(
    async (pageNum, query = "") => {
      if (!user) {
        setError("Please log in to view your posts.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const controller = new AbortController();
      const { signal } = controller;

      try {
        const url = new URL("https://mindscribe.praiseafk.tech/posts/my_post");
        url.searchParams.append("page", pageNum);
        url.searchParams.append("limit", pagination.limit);
        if (query) {
          url.searchParams.append("q", query);
        }

        const response = await apiEngine.get(url.toString(), { signal });

        if (response.data && response.meta) {
          setPosts(response.data);
          setPagination((prev) => ({
            ...prev,
            page: response.meta.page,
            total: response.meta.total,
            totalPages: response.meta.totalPages,
            hasNextPage: response.meta.hasNextPage,
            hasPreviousPage: response.meta.hasPreviousPage,
            currPageTotal: response.meta.currPageTotal,
          }));
        } else {
          setError("Unexpected data structure received.");
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching posts:", error);
          setError("Failed to load your posts. Please try again later.");
        }
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    },
    [pagination.limit, user]
  );

 const deletePost = useCallback(
   async (postId) => {
     if (!user) {
       setError("Please log in to delete your posts.");
       return;
     }

     try {
       setLoading(true);

       const response = await fetch(
         `https://mindscribe.praiseafk.tech/posts/${postId}`,
         {
           method: "DELETE",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
           },
         }
       );

       if (!response.ok) {
         throw new Error("Failed to delete the post.");
       }

       // Remove the deleted post from the state
       setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
     } catch (error) {
       console.error("Error deleting post:", error);
       setError("Failed to delete the post. Please try again later.");
     } finally {
       setLoading(false);
     }
   },
   [user]
 );


  const debouncedSearch = useCallback(
    debounce((query) => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchMyPosts(1, query);
    }, 500),
    [fetchMyPosts]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchMyPosts(newPage, searchQuery);
    },
    [fetchMyPosts, searchQuery]
  );

  useEffect(() => {
    fetchMyPosts(1);
  }, [fetchMyPosts]);

  if (!user) {
    return (
      <div className="error-message">
        <p>Please log in to view your posts.</p>
        <Link to="/login" className="login-link">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <div className="loader-container">
        <BarLoader color={"#000"} loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="blog-page">
      <div className="top-section">
        <h1 className="page-title">My Posts</h1>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search in your posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
          {loading && <ClipLoader size={20} />}
        </div>
        <div className="create-post-button">
          <Link to="/create-post" className="read-more-button">
            Create New Post
          </Link>
        </div>
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                <div className="post-image-container">
                  <img
                    src={post.bannerUrl}
                    alt={post.title}
                    className="post-image"
                  />
                </div>
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span className="published-date">
                      Published: {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="reading-time">
                      Reading Time: {post.readTime} min
                    </span>
                    <span className="post-stats">
                      {post._count.comments === 1
                        ? "1 comment"
                        : `${post._count.comments} comments`}{" "}
                      |{" "}
                      {post._count.likes === 1
                        ? "1 like"
                        : `${post._count.likes} likes`}
                    </span>
                  </div>

                  <div className="post-actions">
                    <Link to={`/posts/${post.id}`} className="read-more-button">
                      View
                    </Link>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="read-more-button"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          !loading && (
            <div className="no-posts">
              <p>No posts found.</p>
              <Link to="/create-post" className="create-first-post-button">
                Create Your First Post
              </Link>
            </div>
          )
        )}
      </div>

      <div className="pagination">
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="pagination-button"
          >
            Previous
          </button>

          <div className="page-numbers">
            {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = idx + 1;
              } else if (pagination.page <= 3) {
                pageNum = idx + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - (4 - idx);
              } else {
                pageNum = pagination.page + idx - 2;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-number ${
                    pagination.page === pageNum ? "active" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
