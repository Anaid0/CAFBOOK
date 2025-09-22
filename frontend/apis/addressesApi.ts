import axios from "axios";

const API_URL = "http://localhost:4200";


export const createAddress = async (addressData: any) => {
  return await axios.post(`${API_URL}/addresses`, addressData);
};


export const getAllAddresses = async () => {
  return await axios.get(`${API_URL}/addresses`);
};


export const getAddressById = async (id: number) => {
  return await axios.get(`${API_URL}/address/${id}`);
};


export const getAddressesByCityId = async (id: number) => {
  return await axios.get(`${API_URL}/address/city/${id}`);
};


export const getAddressesByCityName = async (name: string) => {
  return await axios.get(`${API_URL}/address/city/name/${name}`);
};


export const getAddressByVereda = async (name: string) => {
  return await axios.get(`${API_URL}/address/name/${name}`);
};


export const updateAddress = async (id: number, addressData: any) => {
  return await axios.put(`${API_URL}/address/${id}`, addressData);
};


export const deleteAddress = async (id: number) => {
  return await axios.delete(`${API_URL}/address/${id}`);
};
