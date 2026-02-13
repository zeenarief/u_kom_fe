import { useAuthStore } from '../../store/authStore';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

export default function DashboardHome() {
    const { user } = useAuthStore();

    // --- 1. Cek Role / Context ---
    // Jika user adalah SISWA, tampilkan Dashboard Siswa
    if (user?.profile_context?.type === 'student') {
        return <StudentDashboard />;
    }

    // Default: Admin Dashboard
    // Bisa tambahkan logic permission check lebih detail disini jika perlu
    return <AdminDashboard />;
}