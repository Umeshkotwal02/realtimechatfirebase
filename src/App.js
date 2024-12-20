import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./Components/firebaseConfig";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ChatRoom from "./pages/ChatRoom";
import Header from "./Components/Header";
import Toast from "./Components/Toaster";
import "./App.css"; // Ensure you have the required styles

const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) return null; // Or show a loading spinner here
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <Router>
        <Header />
        <div className="">
          <Toast />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/chatroom"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <ChatRoom />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
