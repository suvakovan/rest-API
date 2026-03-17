export const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function normalizeBaseUrl(baseUrl = DEFAULT_API_BASE_URL) {
  return (baseUrl || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
}

async function readResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function requestJson(path, options = {}, baseUrl = DEFAULT_API_BASE_URL) {
  const response = await fetch(`${normalizeBaseUrl(baseUrl)}${path}`, options);
  const data = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export async function getHealth(baseUrl = DEFAULT_API_BASE_URL) {
  return requestJson("/health", {}, baseUrl);
}

export async function getEntries(baseUrl = DEFAULT_API_BASE_URL) {
  return requestJson("/entries", {}, baseUrl);
}

export async function createEntry(payload, baseUrl = DEFAULT_API_BASE_URL) {
  return requestJson(
    "/entries",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    baseUrl
  );
}

export async function updateEntry(id, payload, baseUrl = DEFAULT_API_BASE_URL) {
  return requestJson(
    `/entries/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    baseUrl
  );
}

export async function deleteEntry(id, baseUrl = DEFAULT_API_BASE_URL) {
  return requestJson(
    `/entries/${id}`,
    {
      method: "DELETE",
    },
    baseUrl
  );
}
