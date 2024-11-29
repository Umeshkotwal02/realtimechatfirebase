import React, { useState } from "react";
import { auth } from "../Components/firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../styles/Login.css";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Track whether the fields have been touched
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Google Authentication
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess(true);
      setError(null);
      navigate("/chatroom");
      toast.success("Welcome!",email)
    } catch (error) {
      setError(error.message);
      setSuccess(false);
      toast.error(`Got Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setTouched({
        email: true,
        password: true
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setError(null);
      navigate("/chatroom");
      toast.success("User Login Successfully");
    } catch (error) {
      setError(error.message);
      setSuccess(false);
      toast.error(`Got Error: ${error.message}`);
    }
  };

  // Handle input focus loss (blur)
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field, value) => {
    if (field === "email") {
      // Check if email is empty or invalid
      return !value || !/\S+@\S+\.\S+/.test(value);
    } else if (field === "password") {
      // Check if password is empty
      return !value;
    }
    return false;
  };

  return (
    <Container fluid className="login-page">
      <Row>
        {/* Left Side - Illustration */}
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="left-section">
          <div style={{ fontFamily: "Cursive" }}>
            <h1 className="title">Join & Be A Part Of The Chat Circle!</h1>
            <p className="subtitle">Please Login To Use the Platform</p>
            <p className="subtitle">Connect with each other...</p>
            <img
              src="/images/cover-img.png"
              alt="cover-img"
              className="illustration"
            />
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="right-section">
          <div className="form-container">
            <h2 className="text-center fw-bold">Login</h2>
            {success && <Alert variant="success">Logged in successfully!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <Form.Group controlId="formEmail">
                <Form.Label>Enter Email<span class="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={touched.email && validateField("email", email) ? "is-invalid" : ""}
                  required
                />
                {touched.email && validateField("email", email) && (
                  <Form.Text className="text-danger">Email is required & must be valid.</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Enter Password<span class="text-danger">*</span></Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={touched.password && validateField("password", password) ? "is-invalid" : ""}
                  required
                />
                {touched.password && validateField("password", password) && (
                  <Form.Text className="text-danger">Password is required.</Form.Text>
                )}
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
              </Form.Group>

              <Form.Group controlId="formRememberMe" className="mt-3">
                <Form.Check type="checkbox" label="Remember Me" />
              </Form.Group>

              <Button variant="primary" className="mt-3 w-100" type="submit">
                Sign In
              </Button>
            </Form>

            <div className="social-login mt-4 text-center" style={{ cursor: "pointer" }}>
              <span className="w-100" onClick={handleGoogleLogin}>
                <span className="fs-3 me-2">
                  <FcGoogle />
                </span>
                Login with Google
              </span>
            </div>

            <p className="mt-3 text-center">
              Don't have an account? <Link to="/signup" className="text-decoration-none">Sign Up</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
