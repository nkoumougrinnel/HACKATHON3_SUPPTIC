import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, UserType } from "../types";

interface UserStoreState {
  profile: UserProfile | null;
  userType: UserType | null;
  token: string | null;
  setUserType: (type: UserType) => void;
  saveProfile: (profile: UserProfile) => void;
  validatePin: (phone: string, pin: string) => boolean;
  logout: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      profile: null,
      userType: null,
      token: null,
      setUserType: (type) => set({ userType: type }),
      saveProfile: (profile) =>
        set({
          profile,
          userType: profile.type,
          token: `token-${profile.matricule}`,
        }),
      validatePin: (phone, pin) => {
        const p = get().profile;
        if (!p) return false;
        const ok = p.phone === phone && p.pin === pin;
        if (ok) set({ token: `token-${p.matricule}` });
        return ok;
      },
      logout: () => set({ token: null }),
    }),
    { name: "songo-user-store" },
  ),
);
