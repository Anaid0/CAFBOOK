import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"
  : "http://10.233.33.254:4200/api";

// 🔹 Obtener todas las empresas
export const getAllCompanies = async () => {
  const res = await axios.get(`${API_URL}/companies`);
  return res.data;
};

// 🔹 Crear empresa
export const createCompany = async (companyData: any) => {
  const res = await axios.post(`${API_URL}/companies`, companyData);
  return res.data;
};

// 🔹 Actualizar empresa
export const updateCompany = async (id: number, companyData: any) => {
  const res = await axios.put(`${API_URL}/companies/${id}`, companyData);
  return res.data;
};

// En apis/companiesApi.ts
export const downCompany = async (id: number) => {
  const res = await axios.put(`${API_URL}/companies/down/${id}`);
  return res.data;
};

export const restoreCompany = async (id: number) => {
  const res = await axios.put(`${API_URL}/companies/restore/${id}`);
  return res.data;
};

// 🔹 Obtener empresa por ID
export const getCompanyById = async (id: number) => {
  const res = await axios.get(`${API_URL}/companies/${id}`);
  return res.data;
};