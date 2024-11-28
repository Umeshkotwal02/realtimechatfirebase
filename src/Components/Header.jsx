import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.warning("User Logout");
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" style={{ height: "65px" }}>
      <Container>
        <Navbar.Brand className="fw-bolder fs-2 fs-md-3 fs-lg-4">
          <Image
            src="/images/logo.png"
            roundedCircle
            style={{ width: "75px" }}
            className="me-3"
          />
          <span
            style={{ fontFamily: "Cursive", fontSize: "2.25rem", whiteSpace: "nowrap" }}
          >
            Welcome To Chat App !!!
          </span>
        </Navbar.Brand>
        <Navbar.Text style={{ fontFamily: "Cursive" }}>
          {user ? (
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-decoration-none text-white">
                Login
              </Link>{" "}
              |{" "}
              <Link to="/signup" className="text-decoration-none text-white ms-1">
                Sign Up free
              </Link>
            </>
          )}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Header;
