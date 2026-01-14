import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './store/authStore';
import type {JSX} from "react";
import UserPage from "./features/users/UserPage";
import StudentPage from "./features/students/StudentPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

// Halaman Dashboard Home Sederhana
const DashboardHome = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Total Siswa</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Total Guru</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">56</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">User Aktif</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">890</p>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Dashboard Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Index Route: Yang tampil saat buka /dashboard */}
                        <Route index element={<DashboardHome />} />

                        {/* Child Routes: Nanti kita isi di sini */}
                        <Route path="users" element={<UserPage />} />
                        <Route path="students" element={<StudentPage />} />
                    </Route>

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;