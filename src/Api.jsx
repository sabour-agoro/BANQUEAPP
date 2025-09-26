import axios from "axios";

const API_BASE_URL = "https://projet-sev-ali.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// helper pour gérer les erreurs
async function handleRequest(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: err.message };
  }
}

// ========== AUTH ==========
export function registerUser(payload) {
  return handleRequest(
    api.post("/auth/register", payload, {
      headers: { "Content-Type": "application/json" },
    })
  );
}

export function loginUser(payload) {
  return handleRequest(api.post("/auth/login", payload));
}

// ========== USERS ==========
export function getUsers(token) {
  return handleRequest(
    api.get("/users/", {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export function updateUser(email, payload, token) {
  return handleRequest(
    api.put(`/users/?email=${email}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export function getUserByEmail(search, token) {
  return handleRequest(
    api.get(`/users/email?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export function getUserById(userId, token) {
  return handleRequest(
    api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export function deleteUserById(userId, token) {
  return handleRequest(
    api.delete(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

// ========== COMPTES ==========
export function getAllComptes(account_type = null) {
  return handleRequest(api.get("/comptes/all", { params: { account_type } }));
}

export function createCompte(payload, token) {
  return handleRequest(
    api.post("/comptes/create", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
  );
}

export function getUserComptes(account_type, token) {
  return handleRequest(
    api.get("/comptes/", {
      headers: { Authorization: `Bearer ${token}` },
      params: { account_type },
    })
  );
}

export function getCompteById(accountId, token) {
  return handleRequest(
    api.get(`/comptes/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export function deleteCompte(accountId, token) {
  return handleRequest(
    api.delete(`/comptes/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

// ========== TRANSACTIONS ==========
export function getAllTransactions(transac_type = null) {
  return handleRequest(api.get("/transactions/all", { params: { transac_type } }));
}

export function getUserTransactions(account_id, transac_type, token) {
  return handleRequest(
    api.get("/transactions/", {
      headers: { Authorization: `Bearer ${token}` },
      params: { account_id, transac_type },
    })
  );
}

export function doTransfert(payload, token) {
  return handleRequest(
    api.post("/transactions/transfert", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
  );
}

export function doRetrait(payload, token) {
  return handleRequest(
    api.post("/transactions/retrait", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
  );
}

export function doDepot(payload, token) {
  return handleRequest(
    api.post("/transactions/depot", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
  );
}

export function getTransactionById(transac_id, account_id, token) {
  return handleRequest(
    api.get(`/transactions/${transac_id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { account_id },
    })
  );
}

// ========== CARTES ==========
export function getAllCartes(carte_type = null) {
  return handleRequest(api.get("/cartes/all", { params: { carte_type } }));
}

export function createCarte(payload, token) {
  return handleRequest(
    api.post("/cartes/create", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
  );
}

export function getUserCartes(carte_type, account_id, token) {
  return handleRequest(
    api.get("/cartes/", {
      headers: { Authorization: `Bearer ${token}` },
      params: { carte_type, account_id },
    })
  );
}

export function getCarteById(carte_id, password, token) {
  return handleRequest(
    api.get(`/cartes/${carte_id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { password },
    })
  );
}

export function deleteCarte(carte_id, password, token) {
  return handleRequest(
    api.delete(`/cartes/${carte_id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { password },
    })
  );
}

export function changeCartePassword(payload, token) {
  return handleRequest(
    api.put("/cartes/change-password", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
  );
}

// ========== ROOT ==========
export function getRoot() {
  return handleRequest(api.get("/"));
}
