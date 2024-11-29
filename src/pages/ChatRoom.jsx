import React, { useEffect, useState } from "react";
import { db, auth } from "../Components/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "../styles/ChatRoom.css";
import { IoHappyOutline, IoSendSharp } from "react-icons/io5";
import UserList from "./UserList";
import Profile from "./Profile";
import EmojiPicker from 'emoji-picker-react';

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // const messagesRef = collection(db, "messages");
  const usersRef = collection(db, "users");

  const getChatCollectionName = (userId1, userId2) => {
    const [id1, id2] = [userId1, userId2].sort(); // Ensure consistent order
    return `messages_user_${id1}_${id2}`;
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!auth.currentUser) return;

      const chatCollectionName = selectedUser
        ? getChatCollectionName(auth.currentUser.uid, selectedUser.id)
        : "messages_global";

      const q = query(collection(db, chatCollectionName), orderBy("createdAt", "asc"));

      // Subscribe to the messages collection
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });

      return () => unsubscribe();
    };

    fetchMessages();
  }, [selectedUser]);

  // Fetch registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(usersRef);
        const userList = userSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.id !== auth.currentUser.uid); // Exclude the current user

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

  useEffect(() => {
    const chatCollectionName = selectedUser
      ? `messages_user_${Math.min(auth.currentUser.uid, selectedUser.id)}_${Math.max(auth.currentUser.uid, selectedUser.id)}`
      : "messages_global"; // Use global chat collection if no user selected

    const q = query(collection(db, chatCollectionName), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs); // Set messages for the current chat
    });

    return () => unsubscribe();
  }, [selectedUser]);



  const sendMessage = async () => {
    if (message.trim() === "") return;

    const currentUser = auth.currentUser;
    const recipientId = selectedUser?.id || "global";

    const chatCollectionName = recipientId !== "global"
      ? getChatCollectionName(currentUser.uid, recipientId)
      : "messages_global";

    try {
      await addDoc(collection(db, chatCollectionName), {
        text: message,
        createdAt: new Date(),
        userId: currentUser.uid,
        recipientId,
        email: currentUser.email,
        username: currentUser.displayName || "",
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native); // Add the selected emoji to the message
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };

  return (
    <Container fluid className="chat-container h-100 w-100">
      <Row>
        <Col xl={3} md={3} xxl={3} sm={12}>
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
        <Col xl={6} md={6} xxl={6} sm={12}>
          <h2 className="fw-bolder text-center">Chats</h2>
          <hr />
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
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.userId === auth.currentUser.uid ? "own-message" : "received-message"}`}
                >
                  <div className="message-meta text-truncate">
                    <span className="username">~ {msg.email}</span>
                  </div>
                  <div className="message-content">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">
                      {new Date(msg.createdAt.toDate()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>


            {/* Chat Input */}
            <div className="chat-input-container">
              <Button>
              <IoHappyOutline onClick={handleEmojiClick}/>
              </Button>

              <Form.Control
                as="textarea"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message"
                className="chat-input"
                style={{ resize: "none" }}
              />

              <Button
                variant="primary"
                onClick={sendMessage}
                className="rounded-circle justify-content-center"
                style={{
                  width: "36px", height: '39px'
                }}
              >
                <span className="fs-3 d-flex justify-content-center align-self-center">
                  <IoSendSharp />
                </span>
              </Button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

            </div>
          </div>
        </Col>
        <Col xl={3} md={3} xxl={3} sm={12}>
          <Profile />
        </Col>
      </Row>
    </Container >
  );
};

export default ChatRoom;
