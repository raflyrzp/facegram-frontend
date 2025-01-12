import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ExplorePeople = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  if (!Array.isArray(users)) {
    return <p>Loading...</p>;
  }

  return (
    <div className="list-group">
      {users.map((user, index) => (
        <div
          key={index}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <Link
            to={`/profile/${user.username}`}
            className="text-decoration-none"
          >
            <h5>{user.username}</h5>
            <p>{user.full_name}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ExplorePeople;
