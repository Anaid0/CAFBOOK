import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createUserPhone = async (phoneData: any) => {
  const res = await axios.post(`${API_URL}/user_phones`, phoneData);
  return res.data;
};


export const getUserPhones = async () => {
  const res = await axios.get(`${API_URL}/user_phones`);
  return res.data;
};


export const getUserPhoneById = async (id: number) => {
  const res = await axios.get(`${API_URL}/user_phones/${id}`);
  return res.data;
};


export const getUserPhoneByPhoneId = async (phoneId: number) => {
  const res = await axios.get(`${API_URL}/user_phones/phones/${phoneId}`);
  return res.data;
};


export const deleteUserPhone = async (id: number) => {
  const res = await axios.delete(`${API_URL}/user_phones/${id}`);
  return res.data;
};


export const updateUserPhone = async (id: number, phoneData: any) => {
  const res = await axios.put(`${API_URL}/user_phones/${id}`, phoneData);
  return res.data;
};
