import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

// User component displaying avatar, name, and username
function User({ avatar, name, username, url }) {
  return (
    <li key={username}>
      <img src={avatar} alt={`Avatar for ${name}`} />
      <div>
        <h2>{name}</h2>
        <p>@{username}</p>
        <a href={url}>View Details</a>
      </div>
    </li>
  );
}

// UserList component fetching data and displaying users
function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://api.github.com/users?per_page=10"
      ); // Fetch 10 users
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <h1>GitHub Users</h1>
      {error ? (
        <p className="error">Error fetching users: {error}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <User key={user.login} {...user} />
          ))}
        </ul>
      )}
    </div>
  );
}

// UserDetails component fetching and displaying extended profile details
function UserDetails({ match }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const username = match.params.username; // Get username from URL parameter
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      setUser(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [match]);

  return (
    <div className="user-details">
      <h1>User Details</h1>
      {isLoading ? (
        <p>Loading user details...</p>
      ) : error ? (
        <p className="error">Error fetching details: {error}</p>
      ) : (
        <div>
          <img src={user.avatar_url} alt={`Avatar for ${user.login}`} />
          <h2>{user.name}</h2>
          <p>Username: @{user.login}</p>
          <p>Company: {user.company || "N/A"}</p>
          <p>Website: {user.blog || "N/A"}</p>
          <p>Social handles:</p>
          <ul>
            {user.social_urls.map((url) => (
              <li key={url.name}>
                <a href={url.url} target="_blank" rel="noreferrer">
                  {url.name}
                </a>
              </li>
            ))}
          </ul>
          <p>Followers: {user.followers}</p>
          <p>Following: {user.following}</p>
          <p>Public repositories: {user.public_repos}</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/users/:username" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
