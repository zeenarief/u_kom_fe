import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../features/users/types';
import type { AuthResponse } from '../types/auth';
import { getAvailableRoles } from '../utils/roleUtils';

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
    ensureActiveRole: () => void; // New action
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            activeRole: null, // Default null

            setAuth: (data) =>
                set((state) => {
                    const roles = data.user.roles || state.user?.roles || [];

                    // Create temporary user object to check available roles
                    const tempUser = { ...data.user, roles };
                    const availableRoles = getAvailableRoles(tempUser);

                    // Priority: try to keep current activeRole if valid, else first available
                    let initialRole = state.activeRole;
                    const isValidRole = availableRoles.some(r => r.id === initialRole);

                    if (!initialRole || !isValidRole) {
                        initialRole = availableRoles.length > 0 ? availableRoles[0].id : null;
                    }

                    return {
                        user: tempUser,
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token,
                        isAuthenticated: true,
                        activeRole: initialRole,
                    };
                }),

            setActiveRole: (role) => set({ activeRole: role }),

            ensureActiveRole: () => {
                const { user, activeRole } = get();
                if (!user) return;

                const availableRoles = getAvailableRoles(user);

                // 1. If no active role, select first available
                if (!activeRole && availableRoles.length > 0) {
                    set({ activeRole: availableRoles[0].id });
                    return;
                }

                // 2. If active role exists but is no longer valid (e.g. lost permission), reset
                if (activeRole && !availableRoles.some(r => r.id === activeRole)) {
                    if (availableRoles.length > 0) {
                        set({ activeRole: availableRoles[0].id });
                    } else {
                        set({ activeRole: null });
                    }
                }
            },

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