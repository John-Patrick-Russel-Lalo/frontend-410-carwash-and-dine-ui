/* eslint-disable no-empty */
// src/auth/authService.js
const API_URL = "https://four10-c-and-d-backend-server.onrender.com";



// ==== TOKEN & USER STORAGE ====
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function setAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

export function removeAccessToken() {
  localStorage.removeItem("accessToken");
}

export function getCurrentUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeCurrentUser() {
  localStorage.removeItem("user");
}

// ==== AUTH STATUS ====
export function isAuthenticated() {
  return !!getAccessToken();
}

// ==== SIGNUP ====
export async function signup(name, email, password) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Signup failed");
  return data;
}

// ==== LOGIN ====
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  // Save access token
  setAccessToken(data.accessToken);

  // Decode token
  const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
  setCurrentUser({
    id: payload.id,
    email: payload.email,
    role: payload.role
  });

  return data;
}

// ==== LOGOUT ====
export async function logout() {
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });
  } catch {}

  removeAccessToken();
  removeCurrentUser();

  window.location.replace("/");

}

// ==== REFRESH TOKEN ====
export async function refreshToken() {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) {
    removeAccessToken();
    removeCurrentUser();
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}

// ==== AUTHENTICATED API CALL ====
export async function apiCall(url, options = {}) {
  let token = getAccessToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    await refreshToken();
    token = getAccessToken();

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }

  return res;
}
