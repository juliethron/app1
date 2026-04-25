const API_URL = "https://api.noroff.dev/api/v2";

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Register returned non-JSON:", text);
    throw new Error("Server error during registration");
  }

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || data.message || "Registration failed");
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

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Login returned non-JSON:", text);
    throw new Error("Server error during login");
  }

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || data.message || "Login failed");
  }

  return data;
}
