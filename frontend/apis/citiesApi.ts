import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)
  
export const createCity = async (cityData: any) => {
  return await axios.post(`${API_URL}/cities`, cityData);
};

export const getAllCities = async () => {
  return await axios.get(`${API_URL}/cities`);
};


export const getCityById = async (id: number) => {
  return await axios.get(`${API_URL}/cities/${id}`);
};


export const getCityByName = async (name: string) => {
  return await axios.get(`${API_URL}/cities/name/${name}`);
};


export const getCitiesByDepartmentId = async (id: number) => {
  return await axios.get(`${API_URL}/cities/department/${id}`);
};


export const getCitiesByDepartmentName = async (name: string) => {
  return await axios.get(`${API_URL}/cities/department/name/${name}`);
};


export const updateCity = async (id: number, cityData: any) => {
  return await axios.put(`${API_URL}/cities/${id}`, cityData);
};


export const deleteCity = async (id: number) => {
  return await axios.delete(`${API_URL}/cities/${id}`);
};
