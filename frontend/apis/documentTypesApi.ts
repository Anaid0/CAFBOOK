import axios from "axios";


const API = "http://localhost:4200/api";


export const createDocumentType = async (documentTypeData: any) => {
  const res = await axios.post(`${API}/document_types`, documentTypeData);
  return res.data;
};


export const getAllDocumentTypes = async () => {
  const res = await axios.get(`${API}/document_types`);
  return res.data;
};


export const getDocumentTypeById = async (id: number) => {
  const res = await axios.get(`${API}/document_types/${id}`);
  return res.data;
};


export const getDocumentTypeByDescription = async (description: string) => {
  const res = await axios.get(`${API}/document_types/description/${description}`);
  return res.data;
};


export const updateDocumentType = async (id: number, documentTypeData: any) => {
  const res = await axios.put(`${API}/document_types/${id}`, documentTypeData);
  return res.data;
};


export const deleteDocumentType = async (id: number) => {
  const res = await axios.delete(`${API}/document_types/${id}`);
  return res.data;
};
