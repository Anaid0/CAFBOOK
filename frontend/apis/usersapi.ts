import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http:192.168.2.30:4200/api"; // Para Android (IP de tu PC en la misma red)


export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const createUser = async (userData: any) => {
  const res = await axios.post(`${API_URL}/users`, userData);
  return res.data;
};


export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/users`);
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

export const updateUser = async (id: number, userData: any, config?: any) => {
  const res = await axios.put(`${API_URL}/users/${id}`, userData, config);
  return res.data;
};


export const downUser = async (id: number) => {
  const res = await axios.put(`${API_URL}/users/down/${id}`);
  return res.data;
};
