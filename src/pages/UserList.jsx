import React, { useState, useEffect } from 'react';
import { Table, Form, Badge } from 'react-bootstrap';

const UserList = ({ users, selectedUser, setSelectedUser, getEmailInitials, currentUserProfile }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const currentTime = new Date();

  // Format the time correctly
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  console.log(formattedTime); // Output: "12:45 AM"

  const formatTime = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) return "Not Available";  // Handle invalid or empty timestamps

    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  };


  const handleUserSelect = (user) => {
    console.log("User selected: ", user);
    setSelectedUser(user);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchQuery = searchTerm.toLowerCase();
    return (
      fullName.includes(searchQuery) ||
      user.username.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div>
      {/* Welcome message */}
      <div className="header-bar">
        <p className="welcome-message ms-3">
          Welcome, {currentUserProfile?.firstName || "Guest"}! 😊
        </p>
        <Form.Control
          className="search-box me-3"
          type="text"
          placeholder="Search by name, username, or email"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* User list */}
      <div className="user-list-content">
        <Table responsive>
          <tbody>
            {/* Common Chat */}
            <tr
              className="user-item"
              style={{
                backgroundColor: !selectedUser ? "#8baccf" : "white",
                cursor: "pointer",
              }}
              onClick={() => setSelectedUser(null)}
            >
              <td>
                <div
                  className="user-avatar"
                  style={{
                    backgroundColor: "#ec8f9f",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span className="avatar-initials" style={{ color: "#fff", fontWeight: "bold" }}>CG</span>
                </div>
              </td>
              <td className="fs-5">Common Chat Group</td>
            </tr>

            {/* Filtered Users */}
            {filteredUsers.map((user) => {
              console.log(user);
              const avatarChar = user.firstName?.charAt(0) || user.email.charAt(0);
              return (
                <tr
                  key={user.id}
                  className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <td>
                    <div
                      className="user-avatar"
                      style={{
                        backgroundColor: getFixedColor(avatarChar),
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="avatar-initials"
                        style={{ color: "#fff", fontWeight: "bold" }}
                      >
                        {getEmailInitials(user.email)}
                      </span>
                    </div>
                  </td>
                  <td className="text-capitalize fs-5" style={{ cursor: "pointer" }}>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username || user.email || "Unknown User"}
                    {user.messageCount > 0 && (
                      <Badge bg="primary" className="ms-2">
                        {user.messageCount}
                      </Badge>
                    )}

                    {/* Display last message time */}
                    <div className="last-message-time">
                      <small className="text-muted">
                        Last message: {user.lastMessageTime ? formatTime(user.lastMessageTime) : "Not Available"}
                      </small>
                    </div>

                  </td>
                </tr>
              );
            })}


          </tbody>
        </Table>
      </div>
    </div>
  );
};

// Function to generate a random background color for avatars
const getFixedColor = (char) => {
  const colors = [
    "#E57373", "#F06292", "#BA68C8", "#9575CD", "#7986CB",
    "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC", "#81C784",
    "#AED581", "#DCE775", "#FFF176", "#FFD54F", "#FFB74D",
    "#FF8A65", "#A1887F", "#90A4AE", "#F44336", "#E91E63",
    "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4",
    "#00BCD4"
  ];
  const index = char.toUpperCase().charCodeAt(0) - 65; // Map 'A'-'Z' to 0-25
  return colors[index % colors.length]; // Cycle through colors
};

export default UserList;
