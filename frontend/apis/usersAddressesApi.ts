import axios from "axios";


const API = "http://localhost:4200";

// 🔹 Crear dirección de usuario
export const createUserAddress = async (addressData: any) => {
  const res = await axios.post(`${API}/user_addresses`, addressData);
  return res.data;
};


export const getUserAddresses = async () => {
  const res = await axios.get(`${API}/user_addresses`);
  return res.data;
};


export const getUserAddressById = async (id: number) => {
  const res = await axios.get(`${API}/user_addresses/${id}`);
  return res.data;
};


export const getUserAddressesByUserId = async (userId: number) => {
  const res = await axios.get(`${API}/user_addresses/user/${userId}`);
  return res.data;
};


export const deleteUserAddress = async (id: number) => {
  const res = await axios.delete(`${API}/user_addresses/${id}`);
  return res.data;
};


export const updateUserAddress = async (id: number, addressData: any) => {
  const res = await axios.put(`${API}/user_addresses/${id}`, addressData);
  return res.data;
};
