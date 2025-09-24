import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createMediaType = async (mediaTypeData: any) => {
  const res = await axios.post(`${API_URL}/media_types`, mediaTypeData);
  return res.data;
};


export const getAllMediaTypes = async () => {
  const res = await axios.get(`${API_URL}/media_types`);
  return res.data;
};


export const getMediaTypeById = async (id: number) => {
  const res = await axios.get(`${API_URL}/media_types/${id}`);
  return res.data;
};


export const getMediaTypeByDescription = async (description: string) => {
  const res = await axios.get(`${API_URL}/media_types/description/${description}`);
  return res.data;
};


export const updateMediaType = async (id: number, mediaTypeData: any) => {
  const res = await axios.put(`${API_URL}/media_types/${id}`, mediaTypeData);
  return res.data;
};


export const deleteMediaType = async (id: number) => {
  const res = await axios.delete(`${API_URL}/media_types/${id}`);
  return res.data;
};
