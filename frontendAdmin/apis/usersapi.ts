import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"
  : "http://192.168.1.2:4200/api";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const createUser = async (userData: any) => {
  const res = await axios.post(`${API_URL}/users`, userData);
  return res.data;
};

export const getUsers = async (token: string) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await axios.get(`${API_URL}/users/${id}`);
  return res.data;
};

export const getUserByEmail = async (email: string) => {
  const res = await axios.get(`${API_URL}/users/email/${email}`);
  return res.data;
};

// ✅ AGREGADO: Función updateUser que faltaba
export const updateUser = async (id: number, userData: any, token: string) => {
  const res = await axios.put(`${API_URL}/users/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const downUser = async (id: number) => {
  const res = await axios.put(`${API_URL}/users/down/${id}`);
  return res.data;
};

export const restoreUser = async (id: number) => {
  const res = await axios.put(`${API_URL}/users/restore/${id}`);
  return res.data;
};
