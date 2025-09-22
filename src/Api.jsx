import axios from "axios";
const API_BASE_URL = "https://projet-sev-ali.onrender.com";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//authenttifaication :

export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}


// users  : 
export async function getUsers(token) {
  const res = await api.get("/users/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateUser(email, payload, token) {
  const res = await api.put(`/users/?email=${email}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserByEmail(search, token) {
  const res = await api.get(`/users/email?search=${search}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserById(userId, token) {
  const res = await api.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteUserById(userId, token) {
  const res = await api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// comptes : 
export async function getAllComptes(account_type = null) {
  const res = await api.get("/comptes/all", { params: { account_type } });
  return res.data;
}

export async function createCompte(payload, token) {
  const res = await api.post("/comptes/create", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserComptes(account_type, token) {
  const res = await api.get("/comptes/", {
    headers: { Authorization: `Bearer ${token}` },
    params: { account_type },
  });
  return res.data;
}

export async function getCompteById(accountId, token) {
  const res = await api.get(`/comptes/${accountId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteCompte(accountId, token) {
  const res = await api.delete(`/comptes/${accountId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// les transactions :   
export async function getAllTransactions(transac_type = null) {
  const res = await api.get("/transactions/all", { params: { transac_type } });
  return res.data;
}

export async function getUserTransactions(account_id, transac_type, token) {
  const res = await api.get("/transactions/", {
    headers: { Authorization: `Bearer ${token}` },
    params: { account_id, transac_type },
  });
  return res.data;
}

export async function doTransfert(payload, token) {
  const res = await api.post("/transactions/transfert", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function doRetrait(payload, token) {
  const res = await api.post("/transactions/retrait", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function doDepot(payload, token) {
  const res = await api.post("/transactions/depot", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getTransactionById(transac_id, account_id, token) {
  const res = await api.get(`/transactions/${transac_id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { account_id },
  });
  return res.data;
}

//les cartes : 
export async function getAllCartes(carte_type = null) {
  const res = await api.get("/cartes/all", { params: { carte_type } });
  return res.data;
}

export async function createCarte(payload, token) {
  const res = await api.post("/cartes/create", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserCartes(carte_type, account_id, token) {
  const res = await api.get("/cartes/", {
    headers: { Authorization: `Bearer ${token}` },
    params: { carte_type, account_id },
  });
  return res.data;
}

export async function getCarteById(carte_id, password, token) {
  const res = await api.get(`/cartes/${carte_id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { password },
  });
  return res.data;
}

export async function deleteCarte(carte_id, password, token) {
  const res = await api.delete(`/cartes/${carte_id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { password },
  });
  return res.data;
}

export async function changeCartePassword(payload, token) {
  const res = await api.put("/cartes/change-password", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// root 
export async function getRoot() {
  const res = await api.get("/");
  return res.data;
}
