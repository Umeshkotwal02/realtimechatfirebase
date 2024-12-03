import React, { useEffect, useState } from "react";
import { Button, Image, Offcanvas } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import Profile from "../pages/Profile";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          {/* Main Navbar Brand */}
          <Navbar.Brand className="fw-bolder">
            <Image
              src="/images/logo.png"
              roundedCircle
              style={{ width: "50px" }}
              className="me-3"
            />
            <span
              className="d-none d-sm-inline text-capitalize"
              style={{ fontFamily: "Cursive", fontSize: "1.5rem" }}
            >
              {user ? `Welcome ${user.displayName || user.email.split('@')[0]} To Chat App !!!` : "Welcome To Chat App !!!"}
            </span>
          </Navbar.Brand>

          {/* Offcanvas Toggle Button for small screens */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(true)} />

          {/* Navbar Text - Displayed on larger screens */}
          <Navbar.Collapse id="offcanvasNavbar" className="d-none d-lg-flex">
            <Navbar.Text className="ms-auto">
              {user ? (
                <div className="d-flex align-items-center">
                  <span
                    className="text-white me-3 d-flex align-items-center"
                    onClick={() => setShowProfile(true)}
                    role="button" // Make it accessible
                  >
                    <CgProfile className="fs-2" />
                  </span>
                  <Button variant="danger" className="ms-2" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <Link to="/login" className="text-decoration-none text-white me-2">
                    Login
                  </Link>
                  <span className="text-white mx-2">|</span>
                  <Link to="/signup" className="text-decoration-none text-white ms-1">
                    Sign Up free
                  </Link>
                </div>
              )}
            </Navbar.Text>

            {/* Render Profile Modal */}
            {showProfile && (
              <Profile
                show={showProfile}
                onHide={() => setShowProfile(false)} // Ensure the state is correctly toggled
              />
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas for Small Screens */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bolder">
            <Image
              src="/images/logo.png"
              roundedCircle
              style={{ width: "75px" }}
              className="me-3"
            />
            <span
              style={{ fontFamily: "Cursive", fontSize: "1.5rem" }}
            >
              Welcome To Chat App !!!
            </span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {user ? (
            <Button variant="danger" onClick={handleLogout} className="w-100">
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login" className="d-block text-decoration-none text-dark">
                Login
              </Link>
              <Link to="/signup" className="d-block text-decoration-none text-dark">
                Sign Up free
              </Link>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
