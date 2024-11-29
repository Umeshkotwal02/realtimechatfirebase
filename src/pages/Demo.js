const UserList = ({ users, selectedUser, setSelectedUser, getEmailInitials }) => {
  return (
    <>
      <div className="user text-center">
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
                <div className="user-avatar" style={avatarStyles("#ec8f9f")}>
                  <span className="avatar-initials" style={avatarTextStyles}>
                    GB
                  </span>
                </div>
              </td>
              <td className="fw-bold">Global Chat Group</td>
            </tr>

            {/* Individual Users */}
            {users.map((user) => (
              <tr
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                onClick={() => handleUserSelect(user)}
              >
                <td>
                  <div className="user-avatar" style={avatarStyles(getRandomColor())}>
                    <span className="avatar-initials" style={avatarTextStyles}>
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

const avatarStyles = (backgroundColor) => ({
  backgroundColor,
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const avatarTextStyles = {
  color: "#fff",
  fontWeight: "bold",
};
