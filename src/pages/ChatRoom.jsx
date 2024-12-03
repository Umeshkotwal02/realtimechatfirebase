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
import { updateDoc, serverTimestamp } from "firebase/firestore";




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
  const [selectedUserLastSeen, setSelectedUserLastSeen] = useState(null);



  const messagesEndRef = useRef(null);
  const userRef = doc(db, "users", auth.currentUser.uid);

  if (auth.currentUser) {
    console.log("Authenticated User ID: ", auth.currentUser.uid);
  } else {
    console.error("User is not authenticated!");
  }


  const updateLastSeen = async () => {
    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          lastSeen: serverTimestamp(),
        });
        console.log("Last seen updated successfully");
      } else {
        console.error("No authenticated user found");
      }
    } catch (error) {
      console.error("Error updating last seen: ", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateLastSeen();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);


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

  useEffect(() => {
    if (selectedUser) {
      const userRef = doc(db, "users", selectedUser.id);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const lastSeenTimestamp = doc.data().lastSeen;
          if (lastSeenTimestamp) {
            setSelectedUserLastSeen(lastSeenTimestamp.toDate());
          } else {
            setSelectedUserLastSeen(null); // Handle no last seen case
          }
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);



  // fetch lastseen
  useEffect(() => {
    const fetchLastSeen = async () => {
      try {
        if (selectedUser) {
          const userRef = doc(db, "users", selectedUser.id);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("User data fetched:", data); // Debug
            setSelectedUserLastSeen(data.lastSeen?.toDate());
          }
        }
      } catch (error) {
        console.error("Error fetching lastSeen:", error);
      }
    };

    fetchLastSeen();
  }, [selectedUser]);

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
      // Send message to Firestore
      await addDoc(collection(db, chatCollectionName), {
        text: message,
        createdAt: new Date(),
        userId: currentUser.uid,
        recipientId,
        email: currentUser.email, // Include the email in the message document
      });
  
      // After sending the message, update lastMessageTime for the current user and the selected user
      await updateDoc(doc(db, "users", currentUser.uid), {
        lastMessageTime: serverTimestamp(),
      });
  
      if (selectedUser) {
        await updateDoc(doc(db, "users", selectedUser.id), {
          lastMessageTime: serverTimestamp(),
        });
      }
  
      setMessage("");  // Clear message input field
    } catch (error) {
      console.error("Error sending message:", error);
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

              <div className="chat-box">
                {/* chat header */}
                <div className="chat-header d-flex justify-content-between align-items-center px-3 py-2">
                  {/* User Info Section */}
                  <div className="d-flex align-items-center">
                    {/* Avatar */}
                    <div
                      className="user-avatar"
                      style={{
                        backgroundColor: "#ec8f9f", // Pink background
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#fff", // White text
                      }}
                    >
                      {selectedUser
                        ? (selectedUser.firstName || selectedUser.username)
                          .charAt(0)
                          .toUpperCase()
                        : "G"}
                    </div>

                    {/* User Name and Last Seen */}
                    <div className="ms-2">
                      <h4 className="mb-0">
                        {selectedUser
                          ? `${selectedUser.firstName} ${selectedUser.lastName || ""}`
                          : "	Common Chat Group"}
                      </h4>

                      {/* Conditional display for Last Seen */}
                      {selectedUser && (
                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                          {selectedUserLastSeen
                            ? `Last seen: ${new Date(selectedUserLastSeen).toLocaleString()}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Search and Video Call Section */}
                  <div className="d-flex gap-3 align-items-center">
                    {/* Search */}
                    <div className="search-container d-flex align-items-center">
                      <IoIosSearch className="search-icon fs-4 me-1" />
                      <Form.Control
                        type="text"
                        placeholder="Search messages"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        style={{ maxWidth: "200px" }}
                      />
                    </div>

                    {/* Video Call Icon */}
                    <span
                      onClick={() =>
                        selectedUser ? startVideoCall(selectedUser.id) : startVideoCall()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <FaVideo className="fs-3 text-white" />
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
      {/* Display the email from the message document */}
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
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ChatRoom;
