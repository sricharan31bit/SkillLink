import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Landing from "../pages/Landing";
import Portal from "../pages/Portal";
import ProjectDetail from "../pages/ProjectDetail";
import Matches from "../pages/Matches";
import PostProject from "../pages/client/PostProject";
import Dashboard from "../pages/Dashboard";
import MyProposals from "../pages/freelancer/MyProposals";
import ProjectProposals from "../pages/client/ProjectProposals";
import Profile from "../pages/freelancer/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/projects/:id/matches" element={<Matches />} />
      <Route path="/projects/:id/dashboard" element={<Dashboard />} />
      <Route path="/projects/:id/proposals" element={<ProjectProposals />} />
      <Route path="/post-project" element={<PostProject />} />
      <Route path="/my-proposals" element={<MyProposals />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;