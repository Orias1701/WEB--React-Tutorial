const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
const staticMode = import.meta.env.VITE_STATIC_MODE === "true";
const staticContentUrl = `${import.meta.env.BASE_URL}landing-content.json`;

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, options);

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

async function getStaticLandingContent() {
  const response = await fetch(staticContentUrl);

  if (!response.ok) {
    throw new Error("Unable to load static landing content.");
  }

  return response.json();
}

export async function getLandingContent() {
  if (staticMode) {
    return getStaticLandingContent();
  }

  try {
    return await request("/landing-content");
  } catch (error) {
    return getStaticLandingContent();
  }
}

export function joinWaitlist(lead) {
  if (staticMode) {
    throw new Error("Waitlist submission is unavailable on GitHub Pages preview.");
  }

  return request("/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lead)
  });
}
