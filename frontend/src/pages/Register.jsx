import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      nameRef.current.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      emailRef.current.focus();
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      passwordRef.current.focus();
      return;
    }
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", loginRes.data.token);

      toast.success("Account created, You're now logged in!");
      setTimeout(() => {
        navigate("/");
      }, 1200);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid input");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="register_container">
        <h1>Create Account</h1>
        <p>Start taking notes today</p>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            ref={nameRef}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            ref={emailRef}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <button className="create-account-btn" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="existing-account">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
