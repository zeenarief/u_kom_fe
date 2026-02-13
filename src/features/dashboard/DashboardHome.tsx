import { useAuthStore } from '../../store/authStore';
import StudentDashboard from './student/StudentDashboard';
import ParentDashboard from './parent/ParentDashboard';
// EmployeeDashboard was removed as we route directly to sub-dashboards
import FinanceDashboard from './employee/FinanceDashboard';
import EducationDashboard from './employee/EducationDashboard';
import TeacherDashboard from './employee/TeacherDashboard';
import AdminDashboard from './admin/AdminDashboard';
import UnregisteredDashboard from './UnregisteredDashboard';

export default function DashboardHome() {
    const { activeRole } = useAuthStore();

    // 1. Strict Admin Check
    // Admin role access is absolute, or we can treat 'admin' as a switchable role too.
    // For now, if role is 'admin', show admin dashboard.
    if (activeRole === 'admin') {
        return <AdminDashboard />;
    }

    // 2. Active Role Routing
    switch (activeRole) {
        case 'student':
            return <StudentDashboard />;
        case 'parent':
        case 'guardian':
            return <ParentDashboard />;
        case 'teacher':
        case 'guru':
            return <TeacherDashboard />;
        case 'finance_admin':
        case 'admin-keuangan':
        case 'finance':
            return <FinanceDashboard />;
        case 'education_admin':
        case 'admin-pendidikan':
        case 'education':
            return <EducationDashboard />;
        // Employee fallback if specific role not found but context is employee
        case 'employee':
            // Fallback to Unregistered if they are 'employee' but have no specific role dashboard
            // Or we could route to a generic "Employee Home" if we had one.
            return <UnregisteredDashboard />;
    }

    // 3. Fallback: Unregistered / No Active Role
    return <UnregisteredDashboard />;
}