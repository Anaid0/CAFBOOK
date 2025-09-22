import axios from "axios";

const API_URL = "http://localhost:4200";


export const createCompanyPhone = async (phoneData: any) => {
  return await axios.post(`${API_URL}/company_phones`, phoneData);
};


export const getAllCompanyPhones = async () => {
  return await axios.get(`${API_URL}/company_phones`);
};


export const getCompanyPhoneById = async (id: number) => {
  return await axios.get(`${API_URL}/company_phones/${id}`);
};


export const getCompanyPhonesByNumber = async (number: string) => {
  return await axios.get(`${API_URL}/company_phones/number/${number}`);
};


export const getCompanyPhonesByBusinessName = async (name: string) => {
  return await axios.get(`${API_URL}/company_phones/company/name/${name}`);
};


export const getCompanyPhonesByPhoneId = async (id: number) => {
  return await axios.get(`${API_URL}/company_phones/phones/${id}`);
};


export const updateCompanyPhone = async (id: number, phoneData: any) => {
  return await axios.put(`${API_URL}/company_phones/${id}`, phoneData);
};


export const deleteCompanyPhone = async (id: number) => {
  return await axios.delete(`${API_URL}/company_phones/${id}`);
};
