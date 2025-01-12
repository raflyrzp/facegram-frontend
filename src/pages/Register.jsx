import React, { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    username: "",
    password: "",
    is_private: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/register",
        formData
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response.data.message || "An error occurred!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 col-6">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="full_name" className="form-label">
                Fullname
              </label>
              <input
                type="text"
                className="form-control"
                id="full_name"
                name="full_name"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                className="form-control"
                id="bio"
                name="bio"
                placeholder="Enter bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength="100"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="is_private"
                name="is_private"
                checked={formData.is_private}
                onChange={(e) =>
                  setFormData({ ...formData, is_private: e.target.checked })
                }
              />
              <label htmlFor="is_private" className="form-check-label">
                Private Account
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            {message && (
              <div className="alert alert-info mt-3" role="alert">
                {message}
              </div>
            )}
          </form>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-decoration-none">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
