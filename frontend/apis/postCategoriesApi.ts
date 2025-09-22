import axios from "axios";


const API = "http://localhost:4200/api";


export const createPostCategory = async (categoryData: any) => {
  const res = await axios.post(`${API}/post_categories`, categoryData);
  return res.data;
};


export const getPostCategories = async () => {
  const res = await axios.get(`${API}/post_categories`);
  return res.data;
};


export const getPostCategoryById = async (id: number) => {
  const res = await axios.get(`${API}/post_categories/${id}`);
  return res.data;
};


export const getPostCategoryByDescription = async (description: string) => {
  const res = await axios.get(`${API}/post_categories/description/${description}`);
  return res.data;
};


export const updatePostCategory = async (id: number, categoryData: any) => {
  const res = await axios.put(`${API}/post_categories/${id}`, categoryData);
  return res.data;
};


export const deletePostCategory = async (id: number) => {
  const res = await axios.delete(`${API}/post_categories/${id}`);
  return res.data;
};
