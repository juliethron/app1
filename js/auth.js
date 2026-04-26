const API_URL = "https://api.noroff.dev/api/v1/social";

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (!response.ok) {
  console.error("LOGIN ERROR FULL RESPONSE:", data);
  throw new Error(
    data.errors?.[0]?.message || 
    data.message || 
    JSON.stringify(data)
  );
}

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("LOGIN ERROR:", data);
    throw new Error(data.errors?.[0]?.message || data.message || "Login failed");
  }

  return data;
}
