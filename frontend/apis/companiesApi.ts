import axios from "axios";

const API_URL = "http://localhost:4200";


export const loginCompany = async (credentials: any) => {
  return await axios.post(`${API_URL}/login`, credentials);
};


export const createCompany = async (companyData: any) => {
  return await axios.post(`${API_URL}/companies`, companyData);
};


export const getAllCompanies = async () => {
  return await axios.get(`${API_URL}/companies`);
};


export const getCompanyById = async (id: number) => {
  return await axios.get(`${API_URL}/companies/${id}`);
};


export const getCompanyByEmail = async (email: string) => {
  return await axios.get(`${API_URL}/companies/email/${email}`);
};


export const updateCompany = async (id: number, companyData: any) => {
  return await axios.put(`${API_URL}/companies/${id}`, companyData);
};


export const downCompany = async (id: number) => {
  return await axios.put(`${API_URL}/companies/down/${id}`);
};
