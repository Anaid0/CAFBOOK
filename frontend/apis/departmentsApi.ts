import axios from "axios";


const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; // Para Android (IP de tu PC en la misma red)


export const createDepartment = async (departmentData: any) => {
  const res = await axios.post(`${API_URL}/departments`, departmentData);
  return res.data;
};


export const getAllDepartments = async () => {
  const res = await axios.get(`${API_URL}/departments`);
  return res.data;
};

export const getDepartmentById = async (id: number) => {
  const res = await axios.get(`${API_URL}/department/${id}`);
  return res.data;
};


export const getDepartmentByName = async (name: string) => {
  const res = await axios.get(`${API_URL}/department/name/${name}`);
  return res.data;
};


export const updateDepartment = async (id: number, departmentData: any) => {
  const res = await axios.put(`${API_URL}/departments/${id}`, departmentData);
  return res.data;
};


export const deleteDepartment = async (id: number) => {
  const res = await axios.delete(`${API_URL}/departments/${id}`);
  return res.data;
};
