import axios from "axios";


const API = "http://localhost:4200/api";


export const createNumberType = async (numberTypeData: any) => {
  const res = await axios.post(`${API}/number_types`, numberTypeData);
  return res.data;
};


export const getNumberTypes = async () => {
  const res = await axios.get(`${API}/number_types`);
  return res.data;
};


export const getNumberTypeById = async (id: number) => {
  const res = await axios.get(`${API}/number_type/${id}`);
  return res.data;
};


export const getNumberTypeByDescription = async (description: string) => {
  const res = await axios.get(`${API}/number_type/description/${description}`);
  return res.data;
};


export const updateNumberType = async (id: number, numberTypeData: any) => {
  const res = await axios.put(`${API}/number_types/${id}`, numberTypeData);
  return res.data;
};


export const deleteNumberType = async (id: number) => {
  const res = await axios.delete(`${API}/number_types/${id}`);
  return res.data;
};
