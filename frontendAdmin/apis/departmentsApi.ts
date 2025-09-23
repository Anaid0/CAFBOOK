import axios from "axios";


const API = "http://localhost:4200";


export const createDepartment = async (departmentData: any) => {
  const res = await axios.post(`${API}/departments`, departmentData);
  return res.data;
};


export const getAllDepartments = async () => {
  const res = await axios.get(`${API}/departments`);
  return res.data;
};

export const getDepartmentById = async (id: number) => {
  const res = await axios.get(`${API}/department/${id}`);
  return res.data;
};


export const getDepartmentByName = async (name: string) => {
  const res = await axios.get(`${API}/department/name/${name}`);
  return res.data;
};


export const updateDepartment = async (id: number, departmentData: any) => {
  const res = await axios.put(`${API}/departments/${id}`, departmentData);
  return res.data;
};


export const deleteDepartment = async (id: number) => {
  const res = await axios.delete(`${API}/departments/${id}`);
  return res.data;
};
