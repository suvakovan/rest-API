import { useState } from "react";
import {
  createEntry,
  DEFAULT_API_BASE_URL,
  deleteEntry,
  getEntries,
  getHealth,
  updateEntry,
} from "./api";

const requestMethods = [
  { method: "GET", endpoint: "/health", description: "Checks API status." },
  { method: "GET", endpoint: "/entries", description: "Lists all entries." },
  {
    method: "POST",
    endpoint: "/entries",
    description: "Creates a new entry with title and note.",
  },
  {
    method: "PUT",
    endpoint: "/entries/:id",
    description: "Updates an entry by id.",
  },
  {
    method: "DELETE",
    endpoint: "/entries/:id",
    description: "Deletes an entry by id.",
  },
];

function parseEntryId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [apiStatus, setApiStatus] = useState("Not checked");
  const [isChecking, setIsChecking] = useState(false);
  const [entryId, setEntryId] = useState("");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryNote, setEntryNote] = useState("");
  const [requestStatus, setRequestStatus] = useState("No request sent yet");
  const [entries, setEntries] = useState([]);
  const [lastResponse, setLastResponse] = useState("{}");
  const [activeAction, setActiveAction] = useState("");

  const resolvedBaseUrl = (apiBaseUrl || DEFAULT_API_BASE_URL)
    .trim()
    .replace(/\/+$/, "");

  const isBusy = Boolean(activeAction);

  const setResponse = (data) => {
    setLastResponse(JSON.stringify(data, null, 2));
  };

  const fetchEntries = async () => {
    const data = await getEntries(apiBaseUrl);
    const list = Array.isArray(data.items) ? data.items : [];
    setEntries(list);
    return { data, list };
  };

  const checkApi = async () => {
    setIsChecking(true);
    setActiveAction("health");

    try {
      const data = await getHealth(apiBaseUrl);
      setApiStatus(data.status ? `Connected: ${data.status}` : "Connected");
      setRequestStatus("GET /health successful");
      setResponse(data);
    } catch (error) {
      setApiStatus(error.message);
      setRequestStatus(error.message);
    } finally {
      setIsChecking(false);
      setActiveAction("");
    }
  };

  const loadEntries = async () => {
    setActiveAction("get");

    try {
      const { data, list } = await fetchEntries();
      setRequestStatus(`GET /entries successful (${list.length} items)`);
      setResponse(data);
    } catch (error) {
      setRequestStatus(error.message);
    } finally {
      setActiveAction("");
    }
  };

  const submitEntry = async (event) => {
    event.preventDefault();

    const title = entryTitle.trim();
    const note = entryNote.trim();

    if (!title || !note) {
      setRequestStatus("POST /entries needs title and note.");
      return;
    }

    setActiveAction("post");

    try {
      const data = await createEntry({ title, note }, apiBaseUrl);
      const { list } = await fetchEntries();
      setRequestStatus(`POST /entries successful. Total entries: ${list.length}`);
      setResponse(data);
      setEntryId(String(data.id || ""));
      setEntryTitle("");
      setEntryNote("");
    } catch (error) {
      setRequestStatus(error.message);
    } finally {
      setActiveAction("");
    }
  };

  const handleUpdateEntry = async () => {
    const id = parseEntryId(entryId);
    const title = entryTitle.trim();
    const note = entryNote.trim();

    if (!id) {
      setRequestStatus("PUT /entries/:id needs a valid numeric id.");
      return;
    }

    if (!title || !note) {
      setRequestStatus("PUT /entries/:id needs title and note.");
      return;
    }

    setActiveAction("put");

    try {
      const data = await updateEntry(id, { title, note }, apiBaseUrl);
      const { list } = await fetchEntries();
      setRequestStatus(`PUT /entries/${id} successful. Total entries: ${list.length}`);
      setResponse(data);
    } catch (error) {
      setRequestStatus(error.message);
    } finally {
      setActiveAction("");
    }
  };

  const handleDeleteEntry = async () => {
    const id = parseEntryId(entryId);

    if (!id) {
      setRequestStatus("DELETE /entries/:id needs a valid numeric id.");
      return;
    }

    setActiveAction("delete");

    try {
      const data = await deleteEntry(id, apiBaseUrl);
      const { list } = await fetchEntries();
      setRequestStatus(
        `DELETE /entries/${id} successful. Remaining entries: ${list.length}`
      );
      setResponse(data);
    } catch (error) {
      setRequestStatus(error.message);
    } finally {
      setActiveAction("");
    }
  };

  const fillFromEntry = (entry) => {
    setEntryId(String(entry.id));
    setEntryTitle(entry.title || "");
    setEntryNote(entry.note || "");
  };

  return (
    <div className="page">
      <div className="bg-shape shape-a" aria-hidden="true" />
      <div className="bg-shape shape-b" aria-hidden="true" />

      <header className="hero reveal">
        <p className="eyebrow">React Frontend Starter</p>
        <h1>Simple Frontend for Your REST API</h1>
        <p className="hero-text">
          Use this page to test all REST methods. Your backend terminal will log
          every request and response for GET, POST, PUT, and DELETE.
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

        <button type="button" onClick={checkApi} disabled={isChecking || isBusy}>
          {isChecking ? "Checking..." : "Check API Connection"}
        </button>

        <p className="status">
          API status: <strong>{apiStatus}</strong>
        </p>
      </header>

      <main className="layout">
        <section className="panel reveal delay-1">
          <h2>REST API Methods</h2>
          <ul className="method-list">
            {requestMethods.map((item) => (
              <li className="method-item" key={`${item.method}-${item.endpoint}`}>
                <span className="method-badge">{item.method}</span>
                <strong>{item.endpoint}</strong>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="hint">All requests are logged in backend terminal output.</p>
        </section>

        <section className="panel reveal delay-2">
          <h2>Send Request</h2>
          <form className="entry-form" onSubmit={submitEntry}>
            <div className="field">
              <label htmlFor="entry-id">Entry ID (for PUT and DELETE)</label>
              <input
                id="entry-id"
                type="number"
                min="1"
                value={entryId}
                onChange={(event) => setEntryId(event.target.value)}
                placeholder="Example: 1"
              />
            </div>

            <div className="field">
              <label htmlFor="entry-title">Title (for POST and PUT)</label>
              <input
                id="entry-title"
                type="text"
                value={entryTitle}
                onChange={(event) => setEntryTitle(event.target.value)}
                placeholder="Example: First API entry"
              />
            </div>

            <div className="field">
              <label htmlFor="entry-note">Note (for POST and PUT)</label>
              <textarea
                id="entry-note"
                value={entryNote}
                onChange={(event) => setEntryNote(event.target.value)}
                placeholder="Type a short note"
              />
            </div>

            <div className="button-row">
              <button type="button" onClick={loadEntries} disabled={isBusy}>
                {activeAction === "get" ? "Loading..." : "GET Entries"}
              </button>
              <button type="submit" disabled={isBusy}>
                {activeAction === "post" ? "Posting..." : "POST Entry"}
              </button>
              <button type="button" onClick={handleUpdateEntry} disabled={isBusy}>
                {activeAction === "put" ? "Updating..." : "PUT Entry"}
              </button>
              <button type="button" onClick={handleDeleteEntry} disabled={isBusy}>
                {activeAction === "delete" ? "Deleting..." : "DELETE Entry"}
              </button>
            </div>
          </form>

          <p className="status">
            Request status: <strong>{requestStatus}</strong>
          </p>
          <p className="hint">Target endpoint: {resolvedBaseUrl}/entries</p>
        </section>

        <section className="panel reveal delay-2 entry-panel">
          <h2>Last JSON Response</h2>
          <pre className="code-block">{lastResponse}</pre>
        </section>

        <section className="panel reveal delay-2 entry-panel">
          <h2>Current Entries</h2>
          {entries.length === 0 ? (
            <p className="empty-state">
              No entries loaded yet. Use GET Entries to fetch data.
            </p>
          ) : (
            <div className="card-list">
              {entries.map((entry) => (
                <article className="card" key={entry.id}>
                  <h3>#{entry.id} {entry.title}</h3>
                  <p>{entry.note}</p>
                  <button type="button" onClick={() => fillFromEntry(entry)}>
                    Use In Form
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
