import axios from "axios";


const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; 

export const createRole = async (roleData: any) => {
  const res = await axios.post(`${API_URL}/roles`, roleData);
  return res.data;
};


export const getRoles = async () => {
  const res = await axios.get(`${API_URL}/roles`);
  return res.data;
};


export const getRoleById = async (id: number) => {
  const res = await axios.get(`${API_URL}/role/${id}`);
  return res.data;
};


export const getRoleByDescription = async (description: string) => {
  const res = await axios.get(`${API_URL}/roles/description/${description}`);
  return res.data;
};


export const deleteRole = async (id: number) => {
  const res = await axios.delete(`${API_URL}/roles/${id}`);
  return res.data;
};


export const updateRole = async (id: number, roleData: any) => {
  const res = await axios.put(`${API_URL}/roles/${id}`, roleData);
  return res.data;
};
