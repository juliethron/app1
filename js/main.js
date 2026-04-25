import { registerUser, loginUser } from "./auth.js";
import { saveToken, getToken } from "./utils.js";
import { getAllPosts, createPost, deletePost } from "./posts.js";

const showLoginBtn = document.querySelector("#show-login");
const showRegisterBtn = document.querySelector("#show-register");

const registerSection = document.querySelector("#register-section");
const authSection = document.querySelector("#auth-section");
const postsSection = document.querySelector("#posts-section");

const registerMessage = document.querySelector("#register-message");
const loginMessage = document.querySelector("#login-message");

showLoginBtn.addEventListener("click", () => {
  registerSection.style.display = "none";
  authSection.style.display = "block";
});

showRegisterBtn.addEventListener("click", () => {
  authSection.style.display = "none";
  registerSection.style.display = "block";
});


document.querySelector("#login-form").addEventListener("submit", handleLogin);
document.querySelector("#register-form").addEventListener("submit", handleRegister);

document.querySelector("#createBtn").addEventListener("click", handleCreatePost);



function setInitialView() {
  const token = getToken();

  if (token) {
    registerSection.style.display = "none";
    authSection.style.display = "none";
    postsSection.style.display = "block";
    loadPosts();
  } else {
    registerSection.style.display = "none";
    authSection.style.display = "block";
    postsSection.style.display = "none";
  }
}



async function handleRegister(event) {
  event.preventDefault();

  const name = document.querySelector("#register-name").value.trim();
  const email = document.querySelector("#register-email").value.trim();
  const password = document.querySelector("#register-password").value.trim();

  registerMessage.textContent = "";

  if (!name || !email || !password) {
    registerMessage.textContent = "Please fill in all register fields.";
    return;
  }

  try {
    await registerUser(name, email, password);
    registerMessage.textContent = "Registration successful! You can now log in.";

    
    registerSection.style.display = "none";
    authSection.style.display = "block";
  } catch (error) {
    registerMessage.textContent = error.message;
  }
}



async function handleLogin(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  loginMessage.textContent = "";

  if (!email || !password) {
    loginMessage.textContent = "Please enter email and password.";
    return;
  }

  try {
    const data = await loginUser(email, password);
    saveToken(data.data.accessToken);

    loginMessage.textContent = "Login successful!";

    authSection.style.display = "none";
    registerSection.style.display = "none";
    postsSection.style.display = "block";

    loadPosts();
  } catch (error) {
    loginMessage.textContent = error.message;
  }
}


async function loadPosts() {
  const postsDiv = document.querySelector("#posts");
  postsDiv.innerHTML = "<p>Loading posts...</p>";

  try {
    const response = await getAllPosts();
    const posts = response.data || [];

    postsDiv.innerHTML = posts
      .map(
        (post) => `
        <div class="post">
          <h3>${post.title || "Untitled post"}</h3>
          <p>${post.body || ""}</p>
          <button type="button" onclick="deletePostHandler('${post.id}')">Delete</button>
        </div>
      `
      )
      .join("");
  } catch (error) {
    postsDiv.innerHTML = `<p>${error.message}</p>`;
  }
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
  } catch (error) {
    alert(error.message);
  }
}


window.deletePostHandler = async function (id) {
  try {
    await deletePost(id);
    loadPosts();
  } catch (error) {
    alert(error.message);
  }
};

setInitialView();
