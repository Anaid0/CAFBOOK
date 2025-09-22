import axios from "axios";


const API = "http://localhost:4200/api";


export const createPhone = async (phoneData: any) => {
  const res = await axios.post(`${API}/phones`, phoneData);
  return res.data;
};


export const getPhones = async () => {
  const res = await axios.get(`${API}/phones`);
  return res.data;
};


export const getPhoneById = async (id: number) => {
  const res = await axios.get(`${API}/phones/${id}`);
  return res.data;
};


export const getPhonesByNumberType = async (numberTypeId: number) => {
  const res = await axios.get(`${API}/phones/type/${numberTypeId}`);
  return res.data;
};


export const updatePhone = async (id: number, phoneData: any) => {
  const res = await axios.put(`${API}/phones/${id}`, phoneData);
  return res.data;
};


export const deletePhone = async (id: number) => {
  const res = await axios.delete(`${API}/phones/${id}`);
  return res.data;
};
