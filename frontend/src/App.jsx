import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import gsap from "gsap";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ThreeBackground from "./three/ThreeBackground";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewPlan from "./pages/NewPlan";
import PlanDetail from "./pages/PlanDetail";
import { useAuth } from "./lib/auth";

export default function App() {
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    gsap.from(".nav", { y: -30, opacity: 0, duration: 0.7, ease: "power3.out" });
  }, []);

  return (
    <>
      <ThreeBackground />
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><NewPlan /></ProtectedRoute>} />
          <Route path="/plan/:id" element={<ProtectedRoute><PlanDetail /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="container">
              <div className="glass card">
                <h2>404</h2>
                <p>Page not found. <Link to="/">Go home</Link></p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </>
  );
}
