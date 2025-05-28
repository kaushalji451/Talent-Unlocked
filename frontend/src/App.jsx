import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddCandidate from "./pages/AddCandidate";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RoleRoute from "./component/RoleRoute";
import Assessment from "./pages/Assessment";
import Score from "./pages/Score";
const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <RoleRoute requiredRole="admin">
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route path="/add" element={<RoleRoute requiredRole="admin"><AddCandidate /></RoleRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/assessment" element={<RoleRoute requiredRole='candidate'><Assessment /></RoleRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/score" element={<Score />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
