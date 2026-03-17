import { useState } from "react";
import { getHealth } from "./api";

const frontendStructure = [
  {
    path: "src/main.jsx",
    role: "Entry point that mounts React into index.html.",
  },
  {
    path: "src/App.jsx",
    role: "Main UI layout and state logic.",
  },
  {
    path: "src/api.js",
    role: "Central place for API calls.",
  },
  {
    path: "src/styles.css",
    role: "Global styles, colors, and responsive rules.",
  },
  {
    path: ".env.example",
    role: "Environment config for API base URL.",
  },
];

const frontendGuidelines = [
  "Put visual components in src/components as the app grows.",
  "Keep fetch logic in service modules, not inside many components.",
  "Use environment variables for API URLs to support dev/staging/prod.",
  "Keep styles organized and mobile-friendly from day one.",
];

export default function App() {
  const [apiStatus, setApiStatus] = useState("Not checked");
  const [isChecking, setIsChecking] = useState(false);

  const checkApi = async () => {
    setIsChecking(true);

    try {
      const data = await getHealth();
      setApiStatus(data.status ? `Connected: ${data.status}` : "Connected");
    } catch (error) {
      setApiStatus(error.message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="page">
      <div className="bg-shape shape-a" aria-hidden="true" />
      <div className="bg-shape shape-b" aria-hidden="true" />

      <header className="hero reveal">
        <p className="eyebrow">React Frontend Starter</p>
        <h1>Simple Frontend for Your REST API</h1>
        <p className="hero-text">
          This starter keeps the structure clear: UI in components, API calls in
          one place, and configuration in environment variables.
        </p>

        <button type="button" onClick={checkApi} disabled={isChecking}>
          {isChecking ? "Checking..." : "Check API Connection"}
        </button>

        <p className="status">
          API status: <strong>{apiStatus}</strong>
        </p>
      </header>

      <main className="layout">
        <section className="panel reveal delay-1">
          <h2>Frontend Structure</h2>
          <div className="card-list">
            {frontendStructure.map((item) => (
              <article className="card" key={item.path}>
                <h3>{item.path}</h3>
                <p>{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel reveal delay-2">
          <h2>How to Organize Frontend Code</h2>
          <ul className="guide-list">
            {frontendGuidelines.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
