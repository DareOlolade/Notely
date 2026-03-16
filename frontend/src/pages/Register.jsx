import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://notely-0tkz.onrender.com/api/auth/register", {
        name: name,
        email: email,
        password: password,
      });
      navigate("/login");
    } catch (error) {
      setError(error.message);
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
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Create account</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="existing-account">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
    </div>
  );
};

export default Register;
