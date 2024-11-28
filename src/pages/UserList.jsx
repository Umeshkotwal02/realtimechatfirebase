import React from 'react';
import { Table } from 'react-bootstrap';

const UserList = ({ users, selectedUser, setSelectedUser, getEmailInitials, loggedInUser }) => {
    // Filter out the logged-in user from the list
    const filteredUsers = users.filter(user => user.email !== loggedInUser?.email);

    return (
        <>
            <div className="user text-center ">
                <h5 className="fw-bolder">Chats</h5>
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
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                                onClick={() => setSelectedUser(user)}
                            >
                                <td>
                                    <div
                                        className="user-avatar"
                                        style={{
                                            backgroundColor: getRandomColor(),
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            className="avatar-initials"
                                            style={{ color: '#fff', fontWeight: 'bold' }}
                                        >
                                            {getEmailInitials(user.email)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className="user-name">
                                        {user.username || user.email || "Unknown User"}
                                    </span>
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