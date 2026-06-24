// Centralized axios instance for Moobits — auto-attaches credentials.
import axios from "axios";

const baseURL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
});

export default api;

export const formatApiErrorDetail = (detail) => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};
