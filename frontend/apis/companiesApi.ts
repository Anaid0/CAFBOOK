import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api";

export const loginCompany = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/companies/login`, { email, password });
  return res.data;
};


export const createCompany = async (companyData: any) => {
  const res = await axios.post(`${API_URL}/companies`, companyData);
  return res.data;
};


export const getAllCompanies = async () => {
  const res = await axios.get(`${API_URL}/companies`);
  return res.data;
};


export const getCompanyById = async (id: number) => {
  const res = await axios.get(`${API_URL}/companies/${id}`);
  return res.data;
};


export const getCompanyByEmail = async (email: string) => {
  const res = await axios.get(`${API_URL}/companies/email/${email}`);
  return res.data;
};


export const updateCompany = async (id: number, companyData: any) => {
  const res = await axios.put(`${API_URL}/companies/${id}`, companyData);
  return res.data;
};


export const downCompany = async (id: number) => {
  const res = await axios.put(`${API_URL}/companies/down/${id}`);
  return res.data;
};
