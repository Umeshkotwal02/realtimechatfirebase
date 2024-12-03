import React, { useEffect, useState } from "react";
import { db, auth } from "../Components/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const Profile = ({ show, onHide }) => {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSave = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
        });
        setCurrentUserProfile(editedProfile);
        toast.success("User Profile Updated Successfully");
        setEditMode(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile");
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="w-100 d-flex justify-content-center fw-bolder">
          <Modal.Title>Profile</Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body>
        {/* Profile details */}
        <div className="text-center mb-3">
          <div className="profile-avatar d-flex justify-content-center">
            {currentUserProfile && currentUserProfile.profilePicture ? (
              <img
                src={currentUserProfile.profilePicture}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
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
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {editMode ? (
          <>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)} className="justify-content-center">
            Edit Profile
          </Button>
        )}
      </Modal.Footer>
    </Modal>

  );
};

export default Profile;
