import { create } from "zustand";
import { api } from "./api";

export const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,

  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, token });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token });
    } finally { set({ loading: false }); }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token });
    } finally { set({ loading: false }); }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
