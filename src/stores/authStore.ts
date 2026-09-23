import { create } from "zustand";

type User = {
  id: number;
  nama: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const userAuthStore = create<AuthState>((set) => ({
  user: null, //belum ada user login

  setUser: (user) => {
    set({ user }); //untuk memasukan User ke zustand
  },

  clearUser: () => {
    set({ user: null }); //ini buat User pas logout
  },
}));
