import axios from "axios";


const API = "http://localhost:4200";


export const createMedia = async (mediaData: any) => {
  const res = await axios.post(`${API}/medias`, mediaData);
  return res.data;
};


export const getMediaById = async (id: number) => {
  const res = await axios.get(`${API}/medias/${id}`);
  return res.data;
};


export const getMediasByType = async (typeId: number) => {
  const res = await axios.get(`${API}/medias/type/${typeId}`);
  return res.data;
};


export const updateMedia = async (id: number, mediaData: any) => {
  const res = await axios.put(`${API}/medias/${id}`, mediaData);
  return res.data;
};


export const deleteMedia = async (id: number) => {
  const res = await axios.delete(`${API}/medias/${id}`);
  return res.data;
};


export const getAllMedias = async () => {
  const res = await axios.get(`${API}/medias`);
  return res.data;
};
