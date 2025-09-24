import axios from "axios";


const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createPhone = async (phoneData: any) => {
  const res = await axios.post(`${API_URL}/phones`, phoneData);
  return res.data;
};


export const getPhones = async () => {
  const res = await axios.get(`${API_URL}/phones`);
  return res.data;
};


export const getPhoneById = async (id: number) => {
  const res = await axios.get(`${API_URL}/phones/${id}`);
  return res.data;
};


export const getPhonesByNumberType = async (numberTypeId: number) => {
  const res = await axios.get(`${API_URL}/phones/type/${numberTypeId}`);
  return res.data;
};


export const updatePhone = async (id: number, phoneData: any) => {
  const res = await axios.put(`${API_URL}/phones/${id}`, phoneData);
  return res.data;
};


export const deletePhone = async (id: number) => {
  const res = await axios.delete(`${API_URL}/phones/${id}`);
  return res.data;
};
