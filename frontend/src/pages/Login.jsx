import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const[email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const[error, setError] = useState(null)
    const navigate = useNavigate()
     const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {email: email, password: password})
            localStorage.setItem("token", response.data.token)
            navigate("/")
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className='auth-page'>
    <div className='login-container'>
        <h1>Welcome back</h1>
        <p>Sign in to your accout</p>
        <form action="" onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
            <button>Sign in</button>
            {error && <p className='error'>{error}</p>}
        </form>
        <p className='register'>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    </div>
  )
}

export default Login