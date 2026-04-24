import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <div className="glass card">
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <form onSubmit={onSubmit}>
          <label className="label">Email</label>
          <input className="input" type="email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div style={{ height: 12 }} />
          <label className="label">Password</label>
          <input className="input" type="password" required minLength={6}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p style={{ color: "var(--danger)", marginTop: 12 }}>{error}</p>}
          <div style={{ height: 16 }} />
          <button className="btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p style={{ color: "var(--muted)", marginTop: 18 }}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
