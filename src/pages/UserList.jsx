// UserList.jsx
import React from 'react';
import { Table } from 'react-bootstrap';

const UserList = ({ users, selectedUser, setSelectedUser, getEmailInitials }) => {
    const handleUserSelect = (user) => {
        console.log("User selected: ", user);
        setSelectedUser(user);
      };
      
    return (
        <>
            <div className="user text-center ">
                <h2 className="fw-bolder">User Contacts</h2>
                <hr />
            </div>
            <div className="user-list-content">
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Global Chat Option */}
                        <tr
                            className={`user-item ${!selectedUser ? "active" : ""}`}
                            onClick={() => setSelectedUser(null)}
                        >
                            <td>
                                <div
                                    className="user-avatar"
                                    style={{
                                        backgroundColor: "#ec8f9f", // Pink background
                                        borderRadius: "50%",
                                        width: "40px",
                                        height: "40px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        className="avatar-initials"
                                        style={{
                                            color: "#fff",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                        }}
                                    >
                                        GB
                                    </span>
                                </div>
                            </td>
                            <td colSpan="2" className="fw-bold">
                                Global Chat Group
                            </td>
                        </tr>

                        {/* Individual Users */}
                        {users.map((user) => (
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
                                            width: "40px",
                                            height: "40px",
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
                                <td className="text-capitalize">
                                    {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.username || user.email || "Unknown User"}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            </div>
        </>
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
