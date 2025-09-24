import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; // Para Android (IP de tu PC en la misma red)

export const createComment = async (id: number, commentData: any) => {
  return await axios.post(`${API_URL}/comments/${id}`, commentData);
};

export const getCommentById = async (id: number) => {
  return await axios.get(`${API_URL}/comments/${id}`);
};

export const getCommentByPost = async (id: number) => {
  return await axios.get(`${API_URL}/comments/post/${id}`);
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
