import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './store/authStore';
import type {JSX} from "react";
import UserPage from "./features/users/UserPage";
import StudentPage from "./features/students/StudentPage";
import RolePage from "./features/roles/RolePage";
import ParentPage from "./features/parents/ParentPage.tsx";
import GuardianPage from "./features/guardians/GuardianPage.tsx";
import EmployeePage from "./features/employees/EmployeePage.tsx";
import DashboardHome from "./features/dashboard/DashboardHome.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AcademicYearPage from "./features/academic-years/AcademicYearPage.tsx";
import ClassroomPage from "./features/classrooms/ClassroomPage.tsx";
import SubjectPage from "./features/subjects/SubjectPage.tsx";
import AssignmentPage from "./features/assignment/AssignmentPage.tsx";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

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
                        <Route path="parents" element={<ParentPage />} />
                        <Route path="guardians" element={<GuardianPage />} />
                        <Route path="employees" element={<EmployeePage />} />

                        <Route path="academic-years" element={<AcademicYearPage />} />
                        <Route path="classrooms" element={<ClassroomPage />} />
                        <Route path="subjects" element={<SubjectPage />} />
                        <Route path="assignments" element={<AssignmentPage />} />

                        <Route path="roles" element={<RolePage />} />
                    </Route>

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;