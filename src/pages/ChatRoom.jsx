import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../Components/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "../styles/ChatRoom.css";
import { IoHappyOutline, IoSendSharp } from "react-icons/io5";
import UserList from "./UserList";
import { emojis } from "./emojis";
import { FaVideo } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import VideoCall from "../Components/VideoCall";



const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");  // State for the search term
  const [roomID, setRoomID] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const messagesEndRef = useRef(null);


  const startVideoCall = (userID) => {
    const callRoomID = `${auth.currentUser.uid}_${userID || "group"}`;
    setRoomID(callRoomID);
    setIsVideoCallActive(true);
  };

  const endVideoCall = () => {
    setIsVideoCallActive(false);
  };

  // Toggle emoji picker visibility
  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  // Add selected emoji to the input field
  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    setIsPickerVisible(false);
  };

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

  // Send a new message
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

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filter messages based on search term
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chatroom-container">
      {isVideoCallActive ? (
        <VideoCall
          roomID={roomID}
          userName={auth.currentUser.displayName || "Anonymous"}
          isGroupCall={!selectedUser}
        />
      ) : (
        <Container fluid className="chat-container h-100 w-100">
          <Row>
            <Col xl={4} md={4} xxl={4} sm={4}>
              <UserList
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                getEmailInitials={(email) => email.split("@")[0].charAt(0).toUpperCase()}
                loggedInUser={currentUserProfile}
                currentUserProfile={currentUserProfile}
              />
            </Col>
            <Col xl={8} md={8} xxl={8} sm={8}>
              {/* <h2 className="fw-bolder text-center">Chats</h2> */}
              {/* <hr /> */}
              <div className="chat-box">
                {/* chat header */}
                <div className="chat-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {/* Display avatar for individual or group */}
                    {selectedUser ? (
                      // Individual User
                      <div className="user-avatar"
                        style={{
                          backgroundColor: "#ec8f9f", // Pink background
                          borderRadius: "50%",
                          width: "45px",
                          height: "45px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        {selectedUser.firstName
                          ? selectedUser.firstName.charAt(0).toUpperCase()  // First letter of first name
                          : selectedUser.username.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      // Group Chat
                      <div className="user-avatar"
                        style={{
                          backgroundColor: "#ec8f9f", // Pink background
                          borderRadius: "50%",
                          width: "45px",
                          height: "45px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        {"G"}
                      </div>
                    )}

                    {/* Display user/group name */}
                    <h4 className="ms-2">
                      {selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                        : "Group Chat"  // Change this as needed for group name
                      }
                    </h4>
                  </div>

                  {/* Search Input */}
                  <div className="d-flex gap-2 align-item-center">
                    <IoIosSearch className="search-icon fs-1 m" />
                    <Form.Control
                      type="text"
                      placeholder="Search messages"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}  // Handle search input
                      className="search-input"
                    />
                    <span
                      // onClick={() =>
                        // selectedUser ? startVideoCall(selectedUser.id) : startVideoCall()
                      // }
                    >
                      {/* Start {selectedUser ? "One-to-One" : "Group"} Video Call */}
                      <FaVideo
                        className="fs-2 text-white"
                        style={{ cursor: "pointer" }}
                      />
                    </span>

                  </div>
                </div>
                {/* Chat Messages */}
                <div className="chat-messages ">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message mb-2 ${msg.userId === auth.currentUser.uid ? "own-message" : "received-message"}`}
                    >
                      <div className="message-meta text-truncate">
                        <span className="username">~ {msg.email}</span>
                      </div>
                      <div className="message-content">
                        <p className="message-text">{msg.text}</p>
                        <div className="message-time text-end">
                          {new Date(msg.createdAt.toDate()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Scroll to the bottom */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Emoji Picker */}
                {isPickerVisible && (
                  <div className="emoji-picker">
                    {emojis.map((emoji, index) => (
                      <span
                        key={index}
                        className="emoji"
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}

                {/* Chat Input */}
                <div className="chat-input-container">
                  <span onClick={togglePicker} className="emoji-btn fs-3 d-flex align-item-center justify-content-center me-2 mt-1">
                    <IoHappyOutline />
                  </span>
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
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      position: "absolute",
                      right: "10px",
                      bottom: "10px",
                    }}
                  >
                    <IoSendSharp size={22} />
                  </Button>
                </div>
              </div>
            </Col>

            {/* <Col xl={3} md={3} xxl={3} sm={12}>
          <Profile currentUserProfile={currentUserProfile} />
        </Col> */}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ChatRoom;
