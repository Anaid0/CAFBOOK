import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createNumberType = async (numberTypeData: any) => {
  const res = await axios.post(`${API_URL}/number_types`, numberTypeData);
  return res.data;
};


export const getNumberTypes = async () => {
  const res = await axios.get(`${API_URL}/number_types`);
  return res.data;
};


export const getNumberTypeById = async (id: number) => {
  const res = await axios.get(`${API_URL}/number_type/${id}`);
  return res.data;
};


export const getNumberTypeByDescription = async (description: string) => {
  const res = await axios.get(`${API_URL}/number_type/description/${description}`);
  return res.data;
};


export const updateNumberType = async (id: number, numberTypeData: any) => {
  const res = await axios.put(`${API_URL}/number_types/${id}`, numberTypeData);
  return res.data;
};


export const deleteNumberType = async (id: number) => {
  const res = await axios.delete(`${API_URL}/number_types/${id}`);
  return res.data;
};
