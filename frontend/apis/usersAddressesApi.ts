import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

// 🔹 Crear dirección de usuario
export const createUserAddress = async (addressData: any) => {
  const res = await axios.post(`${API_URL}/user_addresses`, addressData);
  return res.data;
};


export const getUserAddresses = async () => {
  const res = await axios.get(`${API_URL}/user_addresses`);
  return res.data;
};


export const getUserAddressById = async (id: number) => {
  const res = await axios.get(`${API_URL}/user_addresses/${id}`);
  return res.data;
};


export const getUserAddressesByUserId = async (userId: number) => {
  const res = await axios.get(`${API_URL}/user_addresses/user/${userId}`);
  return res.data;
};


export const deleteUserAddress = async (id: number) => {
  const res = await axios.delete(`${API_URL}/user_addresses/${id}`);
  return res.data;
};


export const updateUserAddress = async (id: number, addressData: any) => {
  const res = await axios.put(`${API_URL}/user_addresses/${id}`, addressData);
  return res.data;
};
