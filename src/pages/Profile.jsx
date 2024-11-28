import React, { useEffect, useState } from "react";
import { db, auth } from "../Components/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container, Row, Table, Button, Form } from "react-bootstrap";

const Profile = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  // Fetch user profile from Firebase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data());
          setEditedProfile(userDoc.data());
        }
      }
    };
    fetchUserProfile();
  }, []);

  const getAvatarStyle = (name) => {
    const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FF6347"];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    return {
      backgroundColor: colors[colorIndex],
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      fontSize: "36px",
      fontWeight: "bold",
      textTransform: "uppercase",
    };
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  // Save updated profile to Firebase
  const handleSave = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
        });
        setCurrentUserProfile(editedProfile);
        setEditMode(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <Container className="profile-container">
      <Row className="justify-content-center">
        <div className="text-center">
          <div className="profile-avatar d-flex justify-content-center">
            {currentUserProfile && currentUserProfile.profilePicture ? (
              <img
                src={currentUserProfile.profilePicture}
                alt="Profile"
                className="avatar-img"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div style={getAvatarStyle(currentUserProfile?.firstName)}>
                {currentUserProfile
                  ? `${currentUserProfile.firstName[0]}${currentUserProfile.lastName[0]}`
                  : "??"}
              </div>
            )}
          </div>
          <h3>
            {currentUserProfile
              ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
              : "User Name"}
          </h3>
          <p>{currentUserProfile ? currentUserProfile.email : "Email not available"}</p>
        </div>
      </Row>
      <Row className="mt-4">
        <Table hover responsive>
          <tbody>
            <tr>
              <td>First Name</td>
              <td>
                {editMode ? (
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={editedProfile.firstName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  currentUserProfile?.firstName || "N/A"
                )}
              </td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>
                {editMode ? (
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={editedProfile.lastName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  currentUserProfile?.lastName || "N/A"
                )}
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{currentUserProfile?.email || "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row className="mt-3">
        {editMode ? (
          <>
            <Button variant="success" className="m-2" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" className="m-2" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </Row>
    </Container>
  );
};

export default Profile;
