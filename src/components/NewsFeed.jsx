import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem("token");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/posts`, {
        params: { page, size: 10 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight &&
      hasMore &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div
      onScroll={handleScroll}
      style={{ height: "80vh", overflowY: "auto" }}
      className="container mt-3"
    >
      {posts.map((post, index) => (
        <div key={index} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.user.username}</h5>
            <p className="card-text">{post.caption}</p>
            {post.attachments && post.attachments.length > 0 && (
              <div>
                {post.attachments.map((attachment, attachmentIndex) => (
                  <img
                    key={attachmentIndex}
                    src={`http://127.0.0.1:8000/storage/${attachment.storage_path}`}
                    alt={`attachment-${attachment.id}`}
                    className="img-fluid"
                  />
                ))}
              </div>
            )}
            <p className="text-muted">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!hasMore && !loading && <p className="text-center">No more posts</p>}
    </div>
  );
};

export default NewsFeed;
