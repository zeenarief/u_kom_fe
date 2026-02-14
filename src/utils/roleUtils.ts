import type { User } from '../features/users/types';

export const getAvailableRoles = (user: User | null) => {
    const roles: { id: string; label: string }[] = [];

    if (!user) return roles;

    // 1. Student
    if (user.profile_context?.type === 'student' || user.roles?.includes('student')) {
        roles.push({ id: 'student', label: 'Siswa' });
    }

    // 2. Parent
    if (['parent', 'guardian'].includes(user.profile_context?.type || '') || user.roles?.some(r => ['parent', 'guardian'].includes(r))) {
        roles.push({ id: 'parent', label: 'Wali Murid' });
    }

    // 3. Employee Roles
    if (user.roles?.includes('teacher') || user.roles?.includes('guru')) {
        roles.push({ id: 'teacher', label: 'Guru' });
    }
    if (user.roles?.includes('finance_admin') || user.roles?.includes('admin-keuangan')) {
        roles.push({ id: 'finance_admin', label: 'Keuangan' });
    }
    if (user.roles?.includes('education_admin') || user.roles?.includes('admin-pendidikan')) {
        roles.push({ id: 'education_admin', label: 'Pendidikan' });
    }

    // 4. Admin
    if (user.roles?.includes('admin') || user.profile_context?.type === 'admin') {
        roles.push({ id: 'admin', label: 'Admin' });
    }

    // Fallback for generic employee if no specific role found
    if (roles.length === 0 && user.profile_context?.type === 'employee') {
        roles.push({ id: 'employee', label: 'Karyawan' });
    }

    return roles;
};
