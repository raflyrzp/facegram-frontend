import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreatePostPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [caption, setCaption] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  if (!token) {
    navigate("/login");
  }

  const handleFileChange = (e) => {
    setAttachments([...attachments, ...Array.from(e.target.files)]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);

    attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
      setErrors([]);
      setCaption("");
      setAttachments([]);

      navigate(`/profile/${localStorage.getItem("username")}`);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setMessage(error.response?.data?.message || "Failed to create post");
      }
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Create New Post</h1>
      {message && (
        <div
          className={`alert ${
            errors.length > 0 ? "alert-danger" : "alert-success"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {Object.entries(errors).map(([field, msgs]) => (
              <li key={field}>{`${field}: ${msgs.join(", ")}`}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="caption" className="form-label">
                Caption
              </label>
              <textarea
                className="form-control"
                id="caption"
                name="caption"
                placeholder="Write a caption for your post"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="attachments" className="form-label">
                Attachments
              </label>
              <input
                type="file"
                className="form-control"
                id="attachments"
                name="attachments"
                multiple
                onChange={handleFileChange}
                required
              />
              <small className="text-muted">
                You can upload multiple images (jpg, jpeg, png, gif, webp). Max
                size: 2MB per file.
              </small>
            </div>
            {attachments.length > 0 && (
              <div className="mb-3">
                <h6>Selected Attachments:</h6>
                <ul className="list-group">
                  {attachments.map((file, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {file.name}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePostPage;
