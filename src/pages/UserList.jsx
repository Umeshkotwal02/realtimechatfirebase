import React, { useState } from 'react';
import { Table, Form, Badge } from 'react-bootstrap';

const UserList = ({ users, selectedUser, setSelectedUser, getEmailInitials, currentUserProfile }) => {
  const [searchTerm, setSearchTerm] = useState("");

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
                  <span className="avatar-initials">CG</span>
                </div>
              </td>
              <td className="fs-5">Common Chat Group</td>
            </tr>

            {/* Filtered Users */}
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                onClick={() => handleUserSelect(user)}
              >
                <td>
                  <div
                    className="user-avatar"
                    style={{
                      backgroundColor: getRandomColor(),
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
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};


// Function to generate a random background color for avatars
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default UserList;
