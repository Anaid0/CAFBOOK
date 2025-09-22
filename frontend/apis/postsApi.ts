import axios from "axios";


const API = "http://localhost:4200/api";


export const createPost = async (postData: any) => {
  const res = await axios.post(`${API}/posts`, postData);
  return res.data;
};


export const getPosts = async () => {
  const res = await axios.get(`${API}/posts`);
  return res.data;
};


export const getPostById = async (id: number) => {
  const res = await axios.get(`${API}/posts/${id}`);
  return res.data;
};


export const getPostsByUserId = async (userId: number) => {
  const res = await axios.get(`${API}/posts/user/${userId}`);
  return res.data;
};


export const getPostsByUserEmail = async (email: string) => {
  const res = await axios.get(`${API}/posts/user/email/${email}`);
  return res.data;
};


export const getPostsByCategoryId = async (categoryId: number) => {
  const res = await axios.get(`${API}/posts/category/${categoryId}`);
  return res.data;
};


export const getPostsByCategoryName = async (name: string) => {
  const res = await axios.get(`${API}/posts/category/name/${name}`);
  return res.data;
};


export const updatePost = async (id: number, postData: any) => {
  const res = await axios.put(`${API}/posts/${id}`, postData);
  return res.data;
};


export const deletePost = async (id: number) => {
  const res = await axios.delete(`${API}/posts/${id}`);
  return res.data;
};
