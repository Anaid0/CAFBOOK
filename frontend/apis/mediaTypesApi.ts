import axios from "axios";


const API = "http://localhost:4200/api";


export const createMediaType = async (mediaTypeData: any) => {
  const res = await axios.post(`${API}/media_types`, mediaTypeData);
  return res.data;
};


export const getAllMediaTypes = async () => {
  const res = await axios.get(`${API}/media_types`);
  return res.data;
};


export const getMediaTypeById = async (id: number) => {
  const res = await axios.get(`${API}/media_types/${id}`);
  return res.data;
};


export const getMediaTypeByDescription = async (description: string) => {
  const res = await axios.get(`${API}/media_types/description/${description}`);
  return res.data;
};


export const updateMediaType = async (id: number, mediaTypeData: any) => {
  const res = await axios.put(`${API}/media_types/${id}`, mediaTypeData);
  return res.data;
};


export const deleteMediaType = async (id: number) => {
  const res = await axios.delete(`${API}/media_types/${id}`);
  return res.data;
};
