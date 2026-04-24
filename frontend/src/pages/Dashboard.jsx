import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/plans").then((r) => setPlans(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Your study plans</h2>
        <Link to="/new"><button className="btn">+ New plan</button></Link>
      </div>

      {loading && <div className="empty">Loading...</div>}
      {!loading && plans.length === 0 && (
        <div className="glass card empty">
          No plans yet. <Link to="/new">Create your first AI study plan</Link>.
        </div>
      )}

      <div className="grid cols-2">
        {plans.map((p) => {
          const total = p.tasks.length || 1;
          const done = p.tasks.filter((t) => t.completed).length;
          const pct = Math.round((done / total) * 100);
          return (
            <Link key={p._id} to={`/plan/${p._id}`} style={{ color: "inherit" }}>
              <div className="glass card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0 }}>{p.title}</h3>
                  <span className="badge">{pct}%</span>
                </div>
                <p style={{ color: "var(--muted)", margin: "8px 0 0" }}>
                  {p.subject} · {p.tasks.length} tasks · {p.hoursPerDay}h/day
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
