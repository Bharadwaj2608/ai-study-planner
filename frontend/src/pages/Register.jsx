import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <div className="glass card">
        <h2 style={{ marginTop: 0 }}>Create your account</h2>
        <form onSubmit={onSubmit}>
          <label className="label">Name</label>
          <input className="input" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div style={{ height: 12 }} />
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div style={{ height: 12 }} />
          <label className="label">Password (min 6)</label>
          <input className="input" type="password" minLength={6} required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p style={{ color: "var(--danger)", marginTop: 12 }}>{error}</p>}
          <div style={{ height: 16 }} />
          <button className="btn" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        </form>
        <p style={{ color: "var(--muted)", marginTop: 18 }}>
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
