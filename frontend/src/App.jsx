import {Route, Routes} from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element ={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  )
}

export default App