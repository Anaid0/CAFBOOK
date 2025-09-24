import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createCropType = async (cropTypeData: any) => {
  return await axios.post(`${API_URL}/crop_types`, cropTypeData);
};


export const getAllCropTypes = async () => {
  return await axios.get(`${API_URL}/crop_types`);
};


export const getCropTypeById = async (id: number) => {
  return await axios.get(`${API_URL}/crop_types/${id}`);
};


export const getCropTypeByDescription = async (description: string) => {
  return await axios.get(`${API_URL}/crop_types/description/${description}`);
};


export const updateCropType = async (id: number, cropTypeData: any) => {
  return await axios.put(`${API_URL}/crop_types/${id}`, cropTypeData);
};


export const deleteCropType = async (id: number) => {
  return await axios.delete(`${API_URL}/crop_types/${id}`);
};

