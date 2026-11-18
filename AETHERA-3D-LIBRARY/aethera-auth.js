
import { createClient } from "@neondatabase/neon-js";
import "./aethera-auth.css";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

if (!authUrl || !dataApiUrl) {
  console.error("Neon Auth or Data API URL is missing.");
}

const neon = authUrl && dataApiUrl
  ? createClient({
      auth: {
        url: authUrl
      },
      dataApi: {
        url: dataApiUrl
      }
    })
  : null;

let currentUser = null;
let pendingOpen = null;

const root = document.createElement("div");
root.id = "aethera-auth-root";
document.body.appendChild(root);

root.innerHTML = `
  <div class="aa-backdrop" hidden>
    <section class="aa-panel" role="dialog"
      aria-modal="true" aria-labelledby="aa-heading">

      <button class="aa-close" type="button"
        aria-label="Close">×</button>

      <div class="aa-symbol">✦</div>
      <div class="aa-brand">A E T H E R A</div>
      <div class="aa-kicker">THE LIBRARY OF UNSPOKEN THINGS</div>

      <h1 id="aa-heading">Every story begins somewhere.</h1>

      <p class="aa-subtitle">
        A private space for the things that matter.
      </p>

      <form id="aa-form">
        <div class="aa-name-field" hidden>
          <label for="aa-name">Your name</label>
          <input id="aa-name" type="text"
            autocomplete="name" maxlength="100">
        </div>

        <label for="aa-email">Email address</label>
        <input id="aa-email" type="email"
          autocomplete="email" required>

        <label for="aa-password">Password</label>
        <input id="aa-password" type="password"
          autocomplete="current-password"
          minlength="8" required>

        <button class="aa-primary" type="submit">
          Enter My Library
        </button>
      </form>

      <div class="aa-divider"><span>OR</span></div>

      <button id="aa-google" class="aa-google" type="button">
        <span class="aa-google-icon">G</span>
        Continue with Google
      </button>

      <p class="aa-switch">
        New to AETHERA?
        <button id="aa-toggle" type="button">
          Create an account
        </button>
      </p>

      <p class="aa-message" role="status" aria-live="polite"></p>

      <div class="aa-footnote">
        YOUR STORIES. YOUR SPACE. YOUR AETHERA.
      </div>
    </section>
  </div>
`;

const backdrop = root.querySelector(".aa-backdrop");
const form = root.querySelector("#aa-form");
const message = root.querySelector(".aa-message");
const nameField = root.querySelector(".aa-name-field");
const submit = root.querySelector(".aa-primary");
const toggle = root.querySelector("#aa-toggle");
const google = root.querySelector("#aa-google");
const close = root.querySelector(".aa-close");

let isSignup = false;
let busy = false;

function setMessage(text) {
  message.textContent = text || "";
}

function setBusy(value) {
  busy = value;
  submit.disabled = value;
  google.disabled = value;
  toggle.disabled = value;
}

function showAuth() {
  backdrop.hidden = false;
  setMessage(
    neon ? "" : "Neon Auth URL is not configured yet."
  );
  root.querySelector("#aa-email").focus();
}

function hideAuth() {
  backdrop.hidden = true;
}

function updateMode() {
  nameField.hidden = !isSignup;
  root.querySelector("#aa-name").required = isSignup;
  root.querySelector("#aa-password").autocomplete =
    isSignup ? "new-password" : "current-password";

  submit.textContent = isSignup
    ? "Create My Library"
    : "Enter My Library";

  toggle.textContent = isSignup
    ? "Already have an account? Sign in"
    : "Create an account";

  setMessage("");
}

function checkResult(result) {
  if (result?.error) {
    throw new Error(
      result.error.message || "Authentication failed."
    );
  }
  return result?.data;
}

async function refreshSession() {
  if (!neon) return null;

  const result = await neon.auth.getSession();
  checkResult(result);

  currentUser = result?.data?.user || null;
  return currentUser;
}

async function completeAuth() {
  const user = await refreshSession();

  if (!user) return false;
  window.dispatchEvent(new Event("aethera:signin"));

  hideAuth();
  renderAccountButton();

  if (pendingOpen) {
    const open = pendingOpen;
    pendingOpen = null;
    open();
  }

  return true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;

  if (!neon) {
    setMessage("Neon client is unavailable. Check the environment configuration.");
    return;
  }

  setMessage("Contacting Neon authentication...");

  const email = root.querySelector("#aa-email").value.trim();
  const password = root.querySelector("#aa-password").value;
  const name = root.querySelector("#aa-name").value.trim();

  try {
    setBusy(true);
    setMessage("");

    if (isSignup) {
      if (!name) throw new Error("Please enter your name.");

      const result = await neon.auth.signUp.email({
        name, email, password
      });

      checkResult(result);

      if (!(await completeAuth())) {
        setMessage(
          "Account created. Check your email for verification, " +
          "then return to sign in."
        );
      }
    } else {
      const result = await neon.auth.signIn.email({
        email, password
      });

      checkResult(result);

      if (!(await completeAuth())) {
        setMessage(
          "Sign-in submitted. Please verify your account if required."
        );
      }
    }
  } catch (error) {
    setMessage(error.message || "Something went wrong.");
  } finally {
    setBusy(false);
  }
});

google.addEventListener("click", async () => {
  setMessage("Google sign-in button clicked.");
  if (busy) return;

  if (!neon) {
    setMessage("Neon client is unavailable. Check the environment configuration.");
    return;
  }

  setMessage("Contacting Neon authentication...");

  try {
    setBusy(true);
    setMessage("");

    const result = await neon.auth.signIn.social({
      provider: "google",
      callbackURL: window.location.origin +
        window.location.pathname
    });

    checkResult(result);
  } catch (error) {
    setMessage(error.message || "Google sign-in failed.");
  } finally {
    setBusy(false);
  }
});

toggle.addEventListener("click", () => {
  isSignup = !isSignup;
  updateMode();
});

close.addEventListener("click", hideAuth);

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) hideAuth();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !backdrop.hidden) {
    hideAuth();
  }
});

const accountButton = document.createElement("button");
accountButton.className = "aa-account-button";
document.body.appendChild(accountButton);

function renderAccountButton() {
  accountButton.textContent = currentUser
    ? "✦ My Account"
    : "✦ Sign In";
}

accountButton.addEventListener("click", async () => {
  if (!currentUser) {
    showAuth();
    return;
  }

  const confirmed = window.confirm(
    "Signed in as " + currentUser.email +
    "\n\nWould you like to sign out?"
  );

  if (!confirmed) return;

  try {
    if (!neon) return;

    const result = await neon.auth.signOut();
    checkResult(result);

    currentUser = null;
    window.dispatchEvent(new Event("aethera:signout"));
    renderAccountButton();
    showAuth();
  } catch (error) {
    window.alert(error.message || "Could not sign out.");
  }
});

// Public interface for later integration with Infinite Books.
window.AetheraAuth = {
  open: showAuth,
  getUser: () => currentUser,
  getClient: () => neon,
  getSession: () => neon ? neon.auth.getSession() : null,
  requireLogin(action) {
    if (currentUser) {
      if (typeof action === "function") action();
      return true;
    }

    pendingOpen =
      typeof action === "function" ? action : null;

    showAuth();
    return false;
  }
};

renderAccountButton();

if (neon) {
  refreshSession()
    .then((user) => { renderAccountButton(); if (user?.id) window.dispatchEvent(new Event("aethera:signin")); })
    .catch((error) => {
      console.warn("Could not restore Neon session:", error);
      currentUser = null;
      renderAccountButton();
    });
}

import('./aethera-cloud.js').catch(console.error);

