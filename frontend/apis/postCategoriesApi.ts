import axios from "axios";
const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http:192.168.2.30:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createPostCategory = async (categoryData: any) => {
  const res = await axios.post(`${API_URL}/post_categories`, categoryData);
  return res.data;
};


export const getPostCategories = async () => {
  const res = await axios.get(`${API_URL}/post_categories`);
  return res.data;
};


export const getPostCategoryById = async (id: number) => {
  const res = await axios.get(`${API_URL}/post_categories/${id}`);
  return res.data;
};


export const getPostCategoryByDescription = async (description: string) => {
  const res = await axios.get(`${API_URL}/post_categories/description/${description}`);
  return res.data;
};


export const updatePostCategory = async (id: number, categoryData: any) => {
  const res = await axios.put(`${API_URL}/post_categories/${id}`, categoryData);
  return res.data;
};


export const deletePostCategory = async (id: number) => {
  const res = await axios.delete(`${API_URL}/post_categories/${id}`);
  return res.data;
};
