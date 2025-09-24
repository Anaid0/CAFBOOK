import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createMedia = async (mediaData: any) => {
  const res = await axios.post(`${API_URL}/medias`, mediaData);
  return res.data;
};


export const getMediaById = async (id: number) => {
  const res = await axios.get(`${API_URL}/medias/${id}`);
  return res.data;
};


export const getMediasByType = async (typeId: number) => {
  const res = await axios.get(`${API_URL}/medias/type/${typeId}`);
  return res.data;
};


export const updateMedia = async (id: number, mediaData: any) => {
  const res = await axios.put(`${API_URL}/medias/${id}`, mediaData);
  return res.data;
};


export const deleteMedia = async (id: number) => {
  const res = await axios.delete(`${API_URL}/medias/${id}`);
  return res.data;
};


export const getAllMedias = async () => {
  const res = await axios.get(`${API_URL}/medias`);
  return res.data;
};
