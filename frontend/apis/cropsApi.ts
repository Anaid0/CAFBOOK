
import axios from "axios";
const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http:192.168.2.30:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createCrop = async (cropData: any) => {
  return await axios.post(`${API_URL}/crops`, cropData);
};


export const getCropById = async (id: number) => {
  return await axios.get(`${API_URL}/crops/${id}`);
};


export const getCropsByTypeId = async (typeId: number) => {
  return await axios.get(`${API_URL}/crops/type/${typeId}`);
};


export const getCropsByTypeName = async (name: string) => {
  return await axios.get(`${API_URL}/crops/type/name/${name}`);
};


export const getCropsByUserEmail = async (email: string) => {
  return await axios.get(`${API_URL}/crops/email/${email}`);
};


export const getAllCrops = async () => {
  return await axios.get(`${API_URL}/crops`);
};


export const updateCrop = async (id: number, cropData: any) => {
  return await axios.put(`${API_URL}/crops/${id}`, cropData);
};


export const deleteCrop = async (id: number) => {
  return await axios.delete(`${API_URL}/crops/${id}`);
};
