import axios from "axios";

const API_URL = "http://localhost:4200";


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
