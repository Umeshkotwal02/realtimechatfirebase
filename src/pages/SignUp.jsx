import React, { useState } from "react";
import { auth } from "../Components/firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../styles/SignUp.css";
import { FcGoogle } from "react-icons/fc";
import { db } from "../Components/firebaseConfig"; // Ensure this is your Firestore config
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    firstname: false,
    lastname: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName || "Anonymous",
        firstName: firstName,
        lastName: lastName,
        createdAt: new Date(),
      });

      setSuccess(true);
      setError(null);
      navigate("/chatroom");
      toast.success("User Register Successfully")

    } catch (error) {
      setError(error.message);
      setSuccess(false);
      toast.error(`Got Error: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        username: user.displayName || "Anonymous",
        createdAt: new Date(),
      });

      setSuccess(true);
      setError(null);
      navigate("/chatroom");
      toast.success("User Register with Google")
    } catch (error) {
      setError(error.message);
      setSuccess(false);
      toast.error("User Google Reg. error", `${error.message}`)
    }
  };

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (field, value) => {
    if (field === "email") {
      // Check if email is empty or invalid
      return !value || !/\S+@\S+\.\S+/.test(value);
    } else if (field === "password") {
      // Check if password is empty
      return !value;
    } else if (field === "firstname") {
      // Check if password is empty
      return !value;
    } else if (field === "lastname") {
      // Check if password is empty
      return !value;
    }
    return false;
  };

  return (
    <Container fluid className="signup-page">
      <Row>
        {/* Left Section - Illustration */}
        <Col md={6} xl={6} xs={6} xxl={6} className="left-section d-flex align-items-center justify-content-center">
          <div>
            <h1 className="title">Register & Be A Part Of The Chat Circle!</h1>
            <p className="subtitle">Start your journey with us, it's free!</p>
            <img
              src="images/cover-img-2.png"
              alt="cover-img-2"
              className="illustration2"
            />
          </div>
        </Col>

        {/* Right Section - Sign Up Form */}
        <Col md={6} xl={6} xs={6} xxl={6} className="right-section">
          <div className="form-container">
            <h2 className="text-center">Sign Up</h2>
            {success && <Alert variant="success">Account created successfully!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}>


              <Form.Group controlId="formFirstName">
                <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => handleFocus("firstname")}
                  className={touched.firstname}
                  required
                />
                {touched.firstname && validateField("firstname", firstName) && (
                  <Form.Text className="text-danger">FirstName is required.</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Last Name<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => handleFocus("lastname")}
                  className={touched.lastname}
                  required
                />
                {touched.lastname && validateField("firstname", lastName) && (
                  <Form.Text className="text-danger">LastName is required.</Form.Text>
                )}
              </Form.Group>
              
              <Form.Group controlId="formEmail">
                <Form.Label>Email<span class="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus("email")}
                  className={touched.email && validateField("email", email) ? "is-invalid" : ""}
                  required
                />
                {touched.email && validateField("email", email) && (
                  <Form.Text className="text-danger">Email is required & must be valid.</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label >Password<span class="text-danger">*</span></Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus("password")}
                  className={touched.password && validateField("password", password) ? "is-invalid" : ""}
                  required
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "relative",
                    right: "-314px",
                    bottom: "47px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {touched.password && validateField("password", password) && (
                  <Form.Text className="text-danger">Password is required.</Form.Text>
                )}
              </Form.Group>



              <Button variant="primary" className="mt-3 w-100" type="submit">
                Sign Up
              </Button>
            </Form>
            <hr />
            <div className="social-login mt-4 text-center" style={{ cursor: "pointer" }}>
              <span className="w-100 " onClick={handleGoogleLogin}>
                <span className="fs-3 me-2">
                  <FcGoogle />
                </span>
                SignUp with Google
              </span>
            </div>

            <p className="mt-3 text-center">
              Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
