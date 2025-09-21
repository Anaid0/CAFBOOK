import axios from "axios";


const API = "http://localhost:4200";


export const createUserPhone = async (phoneData: any) => {
  const res = await axios.post(`${API}/user_phones`, phoneData);
  return res.data;
};


export const getUserPhones = async () => {
  const res = await axios.get(`${API}/user_phones`);
  return res.data;
};


export const getUserPhoneById = async (id: number) => {
  const res = await axios.get(`${API}/user_phones/${id}`);
  return res.data;
};


export const getUserPhoneByPhoneId = async (phoneId: number) => {
  const res = await axios.get(`${API}/user_phones/phones/${phoneId}`);
  return res.data;
};


export const deleteUserPhone = async (id: number) => {
  const res = await axios.delete(`${API}/user_phones/${id}`);
  return res.data;
};


export const updateUserPhone = async (id: number, phoneData: any) => {
  const res = await axios.put(`${API}/user_phones/${id}`, phoneData);
  return res.data;
};
