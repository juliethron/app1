import { getToken } from "./utils.js";

const API_POSTS = "[api.noroff.dev](https://api.noroff.dev/api/v2/social/posts)";

export async function getAllPosts() {
  const token = getToken();
  const response = await fetch(API_POSTS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function createPost(title, body) {
  const token = getToken();
  const response = await fetch(API_POSTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, body }),
  });
  return response.json();
}

export async function deletePost(id) {
  const token = getToken();
  await fetch(`${API_POSTS}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
