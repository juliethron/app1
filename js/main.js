import { registerUser, loginUser } from "./auth.js";
import { saveToken, getToken } from "./utils.js";
import { getAllPosts, createPost, deletePost } from "./posts.js";

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const createBtn = document.querySelector("#createBtn");

const showLoginBtn = document.querySelector("#show-login");
const showRegisterBtn = document.querySelector("#show-register");

const registerSection = document.querySelector("#register-section");
const authSection = document.querySelector("#auth-section");
const postsSection = document.querySelector("#posts-section");

const registerMessage = document.querySelector("#register-message");
const loginMessage = document.querySelector("#login-message");

if (showLoginBtn && showRegisterBtn) {
  showLoginBtn.addEventListener("click", () => {
    authSection.style.display = "block";
    registerSection.style.display = "none";
  });

  showRegisterBtn.addEventListener("click", () => {
    registerSection.style.display = "block";
    authSection.style.display = "none";
  });
}


if (!getToken()) {
  registerSection.style.display = "none";
  authSection.style.display = "block";
  postsSection.style.display = "none";
}


if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}

async function handleRegister(e) {
  e.preventDefault(); 

  const name = document.querySelector("#register-name").value.trim();
  const email = document.querySelector("#register-email").value.trim();
  const password = document.querySelector("#register-password").value.trim();

  registerMessage.textContent = "";

  try {
    await registerUser(name, email, password);

    registerMessage.textContent = "Registration successful! You can now log in.";

    document.querySelector("#register-name").value = "";
    document.querySelector("#register-email").value = "";
    document.querySelector("#register-password").value = "";

    registerSection.style.display = "none";
    authSection.style.display = "block";
  } catch (err) {
    registerMessage.textContent = err.message;
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

async function handleLogin(e) {
  e.preventDefault(); 

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  loginMessage.textContent = "";

  try {
    const data = await loginUser(email, password);
    saveToken(data.accessToken);

    loginMessage.textContent = "Login successful!";

    registerSection.style.display = "none";
    authSection.style.display = "none";
    postsSection.style.display = "block";

    loadPosts();
  } catch (err) {
    loginMessage.textContent = err.message;
  }
}

async function loadPosts() {
  const postsDiv = document.querySelector("#posts");
  postsDiv.innerHTML = "<p>Loading posts...</p>";

  try {
    const posts = await getAllPosts();

    postsDiv.innerHTML = posts
      .map(
        (post) => `
          <div class="post">
            <h3>${post.title}</h3>
            <p>${post.body || ""}</p>
            <button onclick="deletePostHandler('${post.id}')">Delete</button>
          </div>
        `
      )
      .join("");
  } catch (err) {
    postsDiv.innerHTML = `<p>${err.message}</p>`;
  }
}

window.deletePostHandler = async function (id) {
  try {
    await deletePost(id);
    loadPosts();
  } catch (err) {
    alert(err.message);
  }
};

if (createBtn) {
  createBtn.addEventListener("click", handleCreatePost);
}

async function handleCreatePost() {
  const title = document.querySelector("#post-title").value.trim();
  const body = document.querySelector("#post-body").value.trim();

  if (!title) {
    alert("Please enter a post title.");
    return;
  }

  try {
    await createPost(title, body);

    document.querySelector("#post-title").value = "";
    document.querySelector("#post-body").value = "";

    loadPosts();
  } catch (err) {
    alert(err.message);
  }
}

if (getToken()) {
  registerSection.style.display = "none";
  authSection.style.display = "none";
  postsSection.style.display = "block";
  loadPosts();
}
