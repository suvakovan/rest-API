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

export async function getHealth(baseUrl = DEFAULT_API_BASE_URL) {
  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/health`);
  const data = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(data.message || "Unable to reach API.");
  }

  return data;
}

export async function createEntry(payload, baseUrl = DEFAULT_API_BASE_URL) {
  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(data.message || "Unable to create entry.");
  }

  return data;
}
