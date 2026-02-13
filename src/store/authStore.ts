// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../features/users/types';
import type { AuthResponse } from '../types/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    activeRole: string | null; // Currently selected role context

    // Actions
    setAuth: (data: AuthResponse) => void;
    setActiveRole: (role: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            activeRole: null, // Default null

            setAuth: (data) =>
                set((state) => {
                    const roles = data.user.roles || state.user?.roles || [];
                    const profileType = data.user.profile_context?.type;

                    // Determine initial active role
                    // Priority: profile_context.type -> first role -> null
                    let initialRole = profileType;
                    if (!initialRole && roles.length > 0) {
                        initialRole = roles[0];
                    }

                    return {
                        user: {
                            ...data.user,
                            roles: roles,
                        },
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token,
                        isAuthenticated: true,
                        activeRole: initialRole || null,
                    };
                }),

            setActiveRole: (role) => set({ activeRole: role }),

            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    activeRole: null,
                }),
        }),
        {
            name: 'auth-storage', // Nama key di LocalStorage
        }
    )
);