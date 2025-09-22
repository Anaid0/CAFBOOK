import axios from "axios";

const API_URL = "http://localhost:4200/api";


export const createComment = async (commentData: any) => {
  return await axios.post(`${API_URL}/comments`, commentData);
};


export const getCommentById = async (id: number) => {
  return await axios.get(`${API_URL}/comments/${id}`);
};


export const getCommentsByUserId = async (userId: number) => {
  return await axios.get(`${API_URL}/comments/user/${userId}`);
};


export const updateComment = async (id: number, commentData: any) => {
  return await axios.put(`${API_URL}/comments/${id}`, commentData);
};


export const deleteComment = async (id: number) => {
  return await axios.delete(`${API_URL}/comments/${id}`);
};


export const getAllComments = async () => {
  return await axios.get(`${API_URL}/comments`);
};
