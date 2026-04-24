import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import ProgressOrb from "../three/ProgressOrb";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => api.get(`/plans/${id}`).then((r) => setPlan(r.data));

  useEffect(() => { load().finally(() => setLoading(false)); }, [id]);

  const toggle = async (taskId) => {
    const { data } = await api.patch(`/plans/${id}/tasks/${taskId}/toggle`);
    setPlan(data);
  };

  const remove = async () => {
    if (!confirm("Delete this plan?")) return;
    await api.delete(`/plans/${id}`);
    navigate("/dashboard");
  };

  if (loading) return <div className="container empty">Loading...</div>;
  if (!plan) return <div className="container empty">Plan not found</div>;

  const total = plan.tasks.length || 1;
  const done = plan.tasks.filter((t) => t.completed).length;
  const progress = done / total;

  return (
    <div className="container">
      <div className="glass card" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>{plan.title}</h2>
          <p style={{ color: "var(--muted)", margin: "6px 0 12px" }}>
            {plan.subject} · {plan.hoursPerDay}h/day · {plan.level}
          </p>
          <p style={{ margin: 0 }}>{plan.goal}</p>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="btn ghost" onClick={() => navigate("/dashboard")}>← Back</button>
            <button className="btn danger" onClick={remove}>Delete</button>
          </div>
        </div>
        <ProgressOrb progress={progress} />
      </div>

      <div style={{ height: 18 }} />

      <div className="glass card">
        <h3 style={{ marginTop: 0 }}>Schedule</h3>
        {plan.tasks.length === 0 && <div className="empty">No tasks</div>}
        {plan.tasks.map((t) => (
          <div key={t._id} className={`task-row ${t.completed ? "done" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggle(t._id)} />
              <div>
                <div className="topic"><strong>Day {t.day}</strong> — {t.topic}</div>
                <div className="meta">
                  {t.durationMinutes} min{t.resources?.length ? ` · ${t.resources.length} resources` : ""}
                </div>
                {t.resources?.length > 0 && (
                  <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                    {t.resources.map((r, i) => (
                      <li key={i} style={{ fontSize: 13 }}>
                        {/^https?:\/\//.test(r) ? <a href={r} target="_blank" rel="noreferrer">{r}</a> : r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
