import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createPost = async (postData: any) => {
  const res = await axios.post(`${API_URL}/posts`, postData);
  return res.data;
};

export const getPostsActive = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

export const getPosts = async () => {
  const res = await axios.get(`${API_URL}/posts/all`);
  return res.data;
};

export const getPostById = async (id: number) => {
  const res = await axios.get(`${API_URL}/posts/${id}`);
  return res.data;
};

export const getPostsByUserId = async (userId: number) => {
  const res = await axios.get(`${API_URL}/posts/user/${userId}`);
  return res.data;
};

export const getPostsByUserEmail = async (email: string) => {
  const res = await axios.get(`${API_URL}/posts/user/email/${email}`);
  return res.data;
};

export const getPostsByCategoryId = async (categoryId: number) => {
  const res = await axios.get(`${API_URL}/posts/category/${categoryId}`);
  return res.data;
};

export const getPostsByCategoryName = async (name: string) => {
  const res = await axios.get(`${API_URL}/posts/category/name/${name}`);
  return res.data;
};

export const getPostsByUserIdAndCategoryId = async (userId: number, categoryId: number) => {
  const res = await axios.get(`${API_URL}/posts/user/${userId}/category/${categoryId}`);
  return res.data;
};

export const updatePost = async (id: number, postData: any) => {
  const res = await axios.put(`${API_URL}/posts/${id}`, postData);
  return res.data;
};

export const restorePost = async (id: number) => {
  const res = await axios.put(`${API_URL}/posts/restore/${id}`);
  return res.data;
};

export const deletePost = async (id: number) => {
  const res = await axios.delete(`${API_URL}/posts/${id}`);
  return res.data;
};
