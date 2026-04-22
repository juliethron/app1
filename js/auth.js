const API_URL = "[api.noroff.dev](https://api.noroff.dev/api/v2)";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/social/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.errors?.[0]?.message || "Login failed");
  }
  return await response.json();
}

