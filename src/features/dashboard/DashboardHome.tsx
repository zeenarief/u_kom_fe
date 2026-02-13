import { useAuthStore } from '../../store/authStore';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';
import AdminDashboard from './AdminDashboard';

export default function DashboardHome() {
    const { user } = useAuthStore();

    // --- 1. Cek Role / Context ---
    // Jika user adalah SISWA, tampilkan Dashboard Siswa
    if (user?.profile_context?.type === 'student') {
        return <StudentDashboard />;
    }

    // Jika user adalah PARENT atau GUARDIAN (sama saja), tampilkan Dashboard Parent
    const contextType = user?.profile_context?.type;
    if (contextType === 'parent' || contextType === 'guardian') {
        return <ParentDashboard />;
    }

    // Default: Admin Dashboard
    // Bisa tambahkan logic permission check lebih detail disini jika perlu
    return <AdminDashboard />;
}