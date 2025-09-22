import axios from "axios";


const API = "http://localhost:4200";


export const createRole = async (roleData: any) => {
  const res = await axios.post(`${API}/roles`, roleData);
  return res.data;
};


export const getRoles = async () => {
  const res = await axios.get(`${API}/roles`);
  return res.data;
};


export const getRoleById = async (id: number) => {
  const res = await axios.get(`${API}/role/${id}`);
  return res.data;
};


export const getRoleByDescription = async (description: string) => {
  const res = await axios.get(`${API}/roles/description/${description}`);
  return res.data;
};


export const deleteRole = async (id: number) => {
  const res = await axios.delete(`${API}/roles/${id}`);
  return res.data;
};


export const updateRole = async (id: number, roleData: any) => {
  const res = await axios.put(`${API}/roles/${id}`, roleData);
  return res.data;
};
