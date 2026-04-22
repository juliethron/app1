import { registerUser, loginUser } from "./auth.js";
import { saveToken, getToken } from "./utils.js";
import { getAllPosts, createPost, deletePost } from "./posts.js";

const registerBtn = document.querySelector("#registerBtn");
const loginBtn = document.querySelector("#loginBtn");
const createBtn = document.querySelector("#createBtn");
const postsSection = document.querySelector("#posts-section");
const loginMessage = document.querySelector("#login-message");
const registerMessage = document.querySelector("#register-message");

registerBtn.addEventListener("click", handleRegister);
loginBtn.addEventListener("click", handleLogin);
createBtn.addEventListener("click", handleCreatePost);

async function handleRegister() {
  const name = document.querySelector("#register-name").value;
  const email = document.querySelector("#register-email").value;
  const password = document.querySelector("#register-password").value;

  try {
    await registerUser(name, email, password);
    registerMessage.textContent = "Registration successful! You can now log in.";
  } catch (err) {
    registerMessage.textContent = err.message;
  }
}

async function handleLogin() {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const data = await loginUser(email, password);
    saveToken(data.accessToken);
    loginMessage.textContent = "Login successful!";
    document.querySelector("#auth-section").style.display = "none";
    document.querySelector("#register-section").style.display = "none";
    postsSection.style.display = "block";
    loadPosts();
  } catch (err) {
    loginMessage.textContent = err.message;
  }
}

async function loadPosts() {
  const postsDiv = document.querySelector("#posts");
  postsDiv.innerHTML = "<p>Loading posts...</p>";
  const posts = await getAllPosts();

  postsDiv.innerHTML = posts
    .map(
      (p) => `
      <div class="post">
        <h3>${p.title}</h3>
        <p>${p.body || ""}</p>
        <button onclick="deletePostHandler(${p.id})">Delete</button>
      </div>
    `
    )
    .join("");
}

window.deletePostHandler = async function (id) {
  await deletePost(id);
  loadPosts();
};

async function handleCreatePost() {
  const title = document.querySelector("#post-title").value;
  const body = document.querySelector("#post-body").value;
  await createPost(title, body);
  document.querySelector("#post-title").value = "";
  document.querySelector("#post-body").value = "";
  loadPosts();
}

if (getToken()) {
  document.querySelector("#auth-section").style.display = "none";
  document.querySelector("#register-section").style.display = "none";
  postsSection.style.display = "block";
  loadPosts();
}
