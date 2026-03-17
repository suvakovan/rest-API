import { useState } from "react";
import { createEntry, DEFAULT_API_BASE_URL, getHealth } from "./api";

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
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [apiStatus, setApiStatus] = useState("Not checked");
  const [isChecking, setIsChecking] = useState(false);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryNote, setEntryNote] = useState("");
  const [entryStatus, setEntryStatus] = useState("No entry submitted");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkApi = async () => {
    setIsChecking(true);

    try {
      const data = await getHealth(apiBaseUrl);
      setApiStatus(data.status ? `Connected: ${data.status}` : "Connected");
    } catch (error) {
      setApiStatus(error.message);
    } finally {
      setIsChecking(false);
    }
  };

  const submitEntry = async (event) => {
    event.preventDefault();

    const title = entryTitle.trim();
    const note = entryNote.trim();

    if (!title || !note) {
      setEntryStatus("Title and note are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createEntry({ title, note }, apiBaseUrl);
      const entryId = data.id || data.entryId || "created";
      setEntryStatus(`Entry saved (${entryId}).`);
      setEntryTitle("");
      setEntryNote("");
    } catch (error) {
      setEntryStatus(error.message);
    } finally {
      setIsSubmitting(false);
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

        <div className="api-base-url">
          <label htmlFor="api-base-url">Backend base URL</label>
          <input
            id="api-base-url"
            type="url"
            value={apiBaseUrl}
            onChange={(event) => setApiBaseUrl(event.target.value)}
            placeholder="http://localhost:3000"
          />
        </div>

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

        <section className="panel reveal delay-2 entry-panel">
          <h2>Simple Backend Entry</h2>
          <p>
            Submit a basic payload to your backend <strong>/entries</strong>
            endpoint.
          </p>

          <form className="entry-form" onSubmit={submitEntry}>
            <div className="field">
              <label htmlFor="entry-title">Title</label>
              <input
                id="entry-title"
                type="text"
                value={entryTitle}
                onChange={(event) => setEntryTitle(event.target.value)}
                placeholder="Example: First API entry"
              />
            </div>

            <div className="field">
              <label htmlFor="entry-note">Note</label>
              <textarea
                id="entry-note"
                value={entryNote}
                onChange={(event) => setEntryNote(event.target.value)}
                placeholder="Type a short note to send to the backend"
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Entry"}
            </button>
          </form>

          <p className="status">
            Entry status: <strong>{entryStatus}</strong>
          </p>
          <p className="hint">Target endpoint: {apiBaseUrl}/entries</p>
        </section>
      </main>
    </div>
  );
}
