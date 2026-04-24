import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function NewPlan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "", goal: "", examDate: "", hoursPerDay: 2, level: "beginner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/ai/generate-plan", form);
      navigate(`/plan/${data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate plan");
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="glass card">
        <h2 style={{ marginTop: 0 }}>Generate a new study plan</h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Tell the AI what you want to learn — it will return a structured day-by-day schedule.
        </p>
        <form onSubmit={submit}>
          <div className="grid cols-2">
            <div>
              <label className="label">Subject</label>
              <input className="input" required value={form.subject}
                placeholder="e.g. Linear Algebra"
                onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label className="label">Exam date (optional)</label>
              <input className="input" type="date" value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })} />
            </div>
          </div>
          <div style={{ height: 12 }} />
          <label className="label">Goal</label>
          <textarea className="textarea" rows={3} required value={form.goal}
            placeholder="e.g. Pass my university final with at least 80%"
            onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          <div style={{ height: 12 }} />
          <div className="grid cols-2">
            <div>
              <label className="label">Hours per day</label>
              <input className="input" type="number" min={1} max={12} value={form.hoursPerDay}
                onChange={(e) => setForm({ ...form, hoursPerDay: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Current level</label>
              <select className="select" value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          {error && <p style={{ color: "var(--danger)", marginTop: 12 }}>{error}</p>}
          <div style={{ height: 16 }} />
          <button className="btn" disabled={loading}>
            {loading ? "Asking the AI..." : "Generate plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
