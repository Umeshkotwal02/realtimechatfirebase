import React, { useEffect, useState } from "react";
import { db, auth } from "../Components/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "../styles/ChatRoom.css";
import { IoSendSharp } from "react-icons/io5";
import UserList from "./UserList";
import Profile from "./Profile";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const messagesRef = collection(db, "messages");
  const usersRef = collection(db, "users");

  // Fetch messages
  useEffect(() => {
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  // Fetch registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(usersRef);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("userList of Register::", userList);
        setUsers(userList);
      } catch (error) {
        console.error("Fetch User Error :: ", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch current user's profile info
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data());
        }
      }
    };
    fetchUserProfile();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const currentUser = auth.currentUser;
    const recipientId = selectedUser?.id || "global";

    // Send message to Firestore
    await addDoc(messagesRef, {
      text: message,
      createdAt: new Date(),
      userId: currentUser.uid,
      email: currentUser.email,
      username: currentUser.displayName || "",
      recipientId,
    });

    // Send push notification to the recipient (or global if no specific user)
    if (recipientId !== "global") {
      const payload = {
        to: `user_fcm_token_of_${recipientId}`, // Get the recipient's FCM token from Firestore or wherever you store it
        notification: {
          title: `${currentUser.displayName || ""} sent you a message`,
          body: message,
        },
        data: {
          username: currentUser.displayName || "",
          text: message,
        },
      };

      // Make a request to your server to send the FCM message using Firebase Admin SDK
      fetch('/send-fcm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setMessage("");
  };

  return (
    <Container fluid className="chat-container h-100 w-100 mt-3">
      <Row>
        <Col xl={4} md={4} xxl={4} sm={4}>
          {/* Use UserList component */}
          <UserList
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            getEmailInitials={(email) => email.split("@")[0].charAt(0).toUpperCase()}
            loggedInUser={currentUserProfile}
          />
        </Col>

        {/* Chat Box */}
        <Col xl={4} md={4} xxl={4} sm={4}>
          <div className="chat-box">
            <div className="chat-header d-flex justify-content-between align-items-center">
              {/* Profile Avatar */}
              <div className="profile-avatar">
                {currentUserProfile && currentUserProfile.profilePicture ? (
                  <img
                    src={currentUserProfile.profilePicture}
                    alt="Profile"
                    className="avatar-img"
                  />
                ) : (
                  <span className="avatar-initials">
                    {currentUserProfile
                      ? `${currentUserProfile.firstName[0]}${currentUserProfile.lastName[0]}`
                      : "??"}
                  </span>
                )}
              </div>

              {/* User's Name */}
              <h5>
                Welcome,{" "}
                {currentUserProfile
                  ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
                  : "User"}
              </h5>
            </div>

            {/* Chat Header */}
            <div className="chat-header d-flex justify-content-between align-items-center">
              <h5>
                Chat with{" "}
                {selectedUser
                  ? `${selectedUser.username || selectedUser.email}`
                  : "Everyone"}
              </h5>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {messages
                .filter(
                  (msg) =>
                    !selectedUser || msg.recipientId === selectedUser.id || msg.recipientId === "global"
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.userId === auth.currentUser.uid
                      ? "own-message"
                      : "received-message"
                      }`}
                  >
                    <div className="message-meta text-truncate">
                      <span className="username">
                        {msg.username} ~ {msg.email}
                      </span>
                    </div>
                    <div className="message-content">
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt.toDate()).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input-container">
              <Form.Control
                as="textarea"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="chat-input"
                style={{ resize: "none" }}
              />
              <Button
                variant="primary"
                onClick={sendMessage}
                className="send-button rounded-circle"
              >
                <span className="fs-3 d-flex justify-content-center align-self-center">
                  <IoSendSharp />
                </span>
              </Button>
            </div>
          </div>
        </Col>
        <Col xl={4} md={4} xxl={4} sm={4}>
          <Profile />
        </Col>
      </Row>
    </Container>
  );
};

export default ChatRoom;
