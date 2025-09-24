import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createDocumentType = async (documentTypeData: any) => {
  const res = await axios.post(`${API_URL}/document_types`, documentTypeData);
  return res.data;
};


export const getAllDocumentTypes = async () => {
  const res = await axios.get(`${API_URL}/document_types`);
  return res.data;
};


export const getDocumentTypeById = async (id: number) => {
  const res = await axios.get(`${API_URL}/document_types/${id}`);
  return res.data;
};


export const getDocumentTypeByDescription = async (description: string) => {
  const res = await axios.get(`${API_URL}/document_types/description/${description}`);
  return res.data;
};


export const updateDocumentType = async (id: number, documentTypeData: any) => {
  const res = await axios.put(`${API_URL}/document_types/${id}`, documentTypeData);
  return res.data;
};


export const deleteDocumentType = async (id: number) => {
  const res = await axios.delete(`${API_URL}/document_types/${id}`);
  return res.data;
};
