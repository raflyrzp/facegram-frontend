import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { username: urlUsername } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = useCallback(async () => {
    try {
      const userResponse = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/${urlUsername}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(userResponse.data);
      setIsPrivate(userResponse.data.is_private);

      setPosts(userResponse.data.posts);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }, [token, urlUsername]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [token, navigate, fetchUserData]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to delete the post"
      );
    }
  };

  if (!user) {
    return <div>User not found.</div>;
  }

  const currentUser = localStorage.getItem("username");

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Profile</h1>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2>{user.full_name}</h2>
          <h5 className="text-muted">@{user.username}</h5>
          <p>{user.bio}</p>
        </div>
      </div>
      <div>
        <h3>Posts</h3>
        {isPrivate ? (
          <p className="text-muted">The account is private</p>
        ) : (
          <>
            <p>Total posts: {posts.length}</p>
            <ul className="list-group">
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

                  {post.user.username === currentUser && (
                    <button
                      className="btn btn-sm btn-danger col-4"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
