import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/login",
        credentials
      );
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);

      const username = response.data.user.username;
      navigate(`/profile/${username}`);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 col-4">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
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
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            {message && (
              <div className="alert alert-info mt-3" role="alert">
                {message}
              </div>
            )}
          </form>
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a href="/register" className="text-decoration-none">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
