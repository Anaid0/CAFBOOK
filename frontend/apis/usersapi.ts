import axios from "axios";


const API = "http://localhost:4200"; 


export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API}/login`, { email, password });
  return res.data;
};


export const createUser = async (userData: any) => {
  const res = await axios.post(`${API}/users`, userData);
  return res.data;
};


export const getUsers = async () => {
  const res = await axios.get(`${API}/users`);
  return res.data;
};


export const getUserById = async (id: number) => {
  const res = await axios.get(`${API}/users/${id}`);
  return res.data;
};


export const getUserByEmail = async (email: string) => {
  const res = await axios.get(`${API}/users/email/${email}`);
  return res.data;
};


export const updateUser = async (id: number, userData: any) => {
  const res = await axios.put(`${API}/users/${id}`, userData);
  return res.data;
};


export const downUser = async (id: number) => {
  const res = await axios.put(`${API}/users/down/${id}`);
  return res.data;
};
