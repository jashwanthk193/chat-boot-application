import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api"; // backend base URL

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Create axios instance with token automatically
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers before each request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all castes
export const getusers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data; // ensure you return the array
};
// Send a new message
export const postMessage = async (messageData) => {
  const response = await axiosInstance.post("/messages", messageData);
  return response.data;
};
// export const getMessage = async (senderid,receiverid) => {
//   const response = await axiosInstance.post("/messages", senderid,receiverid);
//   return response.data;
// };
export const getMessages = async (senderId, receiverId) => {
  const response = await axiosInstance.get(`/messages/chat/${senderId}/${receiverId}`);
  return response.data;
};
// ✅ Get all messages where the logged-in user is the receiver
export const getMessagesByReceiver = async (receiverId) => {
  const response = await axiosInstance.get(`/messages/receiver/${receiverId}`);
  return response.data;
};
