import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("h1", { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
      gsap.from("p.lead", { y: 20, opacity: 0, duration: 1, delay: 0.15, ease: "power3.out" });
      gsap.from(".cta", { y: 20, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
      gsap.from(".feature", {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.5, ease: "power3.out",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      <section className="hero">
        <h1>Plan smarter. Learn deeper.</h1>
        <p className="lead">
          AI Study Planner turns your subject, goal, and exam date into a personalized,
          day-by-day study schedule — visualized in an immersive 3D space.
        </p>
        <div className="cta" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/register"><button className="btn">Get started</button></Link>
          <Link to="/login"><button className="btn ghost">I have an account</button></Link>
        </div>
      </section>

      <section className="container">
        <div className="grid cols-3">
          {[
            { title: "AI plan generation", body: "Describe your goal — get a structured day-by-day plan with topics, durations, and resources." },
            { title: "3D progress orb", body: "Watch your plan come alive: completion drives color, glow, and motion." },
            { title: "Track & adapt", body: "Tick off tasks, edit plans, and stay on schedule." },
          ].map((f) => (
            <div key={f.title} className="glass card feature">
              <h3 style={{ marginTop: 0 }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
