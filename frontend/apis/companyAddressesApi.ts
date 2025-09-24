import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)


export const createCompanyAddress = async (addressData: any) => {
  return await axios.post(`${API_URL}/company_addresses`, addressData);
};


export const getAllCompanyAddresses = async () => {
  return await axios.get(`${API_URL}/company_addresses`);
};


export const getCompanyAddressById = async (id: number) => {
  return await axios.get(`${API_URL}/company_addresses/${id}`);
};


export const getCompanyAddressesByBusinessName = async (name: string) => {
  return await axios.get(`${API_URL}/company_addresses/company/name/${name}`);
};


export const getCompanyAddressesByDepartmentName = async (name: string) => {
  return await axios.get(`${API_URL}/company_addresses/department/name/${name}`);
};


export const getCompanyAddressesByAddressId = async (id: number) => {
  return await axios.get(`${API_URL}/company_addresses/company/${id}`);
};


export const updateCompanyAddress = async (id: number, addressData: any) => {
  return await axios.put(`${API_URL}/company_addresses/${id}`, addressData);
};


export const deleteCompanyAddress = async (id: number) => {
  return await axios.delete(`${API_URL}/company_addresses/${id}`);
};
