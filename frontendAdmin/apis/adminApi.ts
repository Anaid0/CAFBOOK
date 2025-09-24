import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://10.233.33.254:4200/api"; // Para Android (IP de tu PC en la misma red)

// 🔹 Login Admin
export const loginAdmin = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/admin/login`, { email, password });
  return res.data;
};

// 🔹 Crear Admin
export const createAdmin = async (adminData: any) => {
  const res = await axios.post(`${API_URL}/admin`, adminData);
  return res.data;
};

// 🔹 Obtener todos los Admins (requiere token)
export const getAdmins = async (token: string) => {
  const res = await axios.get(`${API_URL}/admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 🔹 Buscar Admin por ID
export const getAdminById = async (id: number) => {
  const res = await axios.get(`${API_URL}/admin/${id}`);
  return res.data;
};

// 🔹 Buscar Admin por Email
export const getAdminByEmail = async (email: string) => {
  const res = await axios.get(`${API_URL}/admin/email/${email}`);
  return res.data;
};

// 🔹 Actualizar Admin
export const updateAdmin = async (id: number, adminData: any) => {
  const res = await axios.put(`${API_URL}/admin/${id}`, adminData);
  return res.data;
};

// ✅ CORREGIDO: Función para desactivar admin (no confundir con companies)
export const downAdmin = async (id: number) => {
  const res = await axios.put(`${API_URL}/admin/down/${id}`);
  return res.data;
};