import React, { useEffect, useState } from "react";
import { Button, Image, Offcanvas } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
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
      <Navbar bg="dark" data-bs-theme="dark" style={{ height: "65px" }} expand="lg">
        <Container>
          {/* Main Navbar Brand */}
          <Navbar.Brand className="fw-bolder">
            <Image
              src="/images/logo.png"
              roundedCircle
              style={{ width: "75px" }}
              className="me-3"
            />
            <span
              className="d-none d-sm-inline"
              style={{ fontFamily: "Cursive", fontSize: "1.5rem" }}
            >
              Welcome To Chat App !!!
            </span>
          </Navbar.Brand>

          {/* Offcanvas Toggle Button for small screens */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(true)} />

          {/* Navbar Text - Displayed on larger screens */}
          <Navbar.Collapse id="offcanvasNavbar" className="d-none d-lg-flex">
            <Navbar.Text className="ms-auto">
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
