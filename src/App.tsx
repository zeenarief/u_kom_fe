import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AlertModal from './components/ui/AlertModal';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './store/authStore';
import type { JSX } from "react";
import UserPage from "./features/users/UserPage";
import StudentPage from "./features/students/StudentPage";
import StudentDetailPage from "./features/students/StudentDetailPage";
import StudentCreatePage from "./features/students/StudentCreatePage";
import StudentEditPage from "./features/students/StudentEditPage";
import RolePage from "./features/roles/RolePage";
import ParentPage from "./features/parents/ParentPage.tsx";
import ParentCreatePage from "./features/parents/ParentCreatePage.tsx";
import ParentDetailPage from "./features/parents/ParentDetailPage.tsx";
import ParentEditPage from "./features/parents/ParentEditPage.tsx";
import GuardianPage from "./features/guardians/GuardianPage.tsx";
import GuardianCreatePage from "./features/guardians/GuardianCreatePage.tsx";
import GuardianDetailPage from "./features/guardians/GuardianDetailPage.tsx";
import GuardianEditPage from "./features/guardians/GuardianEditPage.tsx";
import EmployeePage from "./features/employees/EmployeePage.tsx";
import EmployeeCreatePage from "./features/employees/EmployeeCreatePage.tsx";
import EmployeeDetailPage from "./features/employees/EmployeeDetailPage.tsx";
import EmployeeEditPage from "./features/employees/EmployeeEditPage.tsx";
import DashboardHome from "./features/dashboard/DashboardHome.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AcademicYearPage from "./features/academic-years/AcademicYearPage.tsx";
import ClassroomPage from "./features/classrooms/ClassroomPage.tsx";
import SubjectPage from "./features/subjects/SubjectPage.tsx";
import AssignmentPage from "./features/assignments/AssignmentPage.tsx";
import SchedulePage from "./features/schedules/SchedulePage.tsx";
import ProfilePage from "./features/profile/ProfilePage.tsx";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                containerStyle={{
                    zIndex: 999999, // Ensure container is highest
                }}
                toastOptions={{
                    style: {
                        zIndex: 99999,
                    },
                }}
            />
            <AlertModal />
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
                        <Route path="students/create" element={<StudentCreatePage />} />
                        <Route path="students/:id" element={<StudentDetailPage />} />
                        <Route path="students/:id/edit" element={<StudentEditPage />} />
                        <Route path="parents" element={<ParentPage />} />
                        <Route path="parents/create" element={<ParentCreatePage />} />
                        <Route path="parents/:id" element={<ParentDetailPage />} />
                        <Route path="parents/:id/edit" element={<ParentEditPage />} />
                        <Route path="guardians" element={<GuardianPage />} />
                        <Route path="guardians/create" element={<GuardianCreatePage />} />
                        <Route path="guardians/:id" element={<GuardianDetailPage />} />
                        <Route path="guardians/:id/edit" element={<GuardianEditPage />} />
                        <Route path="employees" element={<EmployeePage />} />
                        <Route path="employees/create" element={<EmployeeCreatePage />} />
                        <Route path="employees/:id" element={<EmployeeDetailPage />} />
                        <Route path="employees/:id/edit" element={<EmployeeEditPage />} />

                        <Route path="academic-years" element={<AcademicYearPage />} />
                        <Route path="classrooms" element={<ClassroomPage />} />
                        <Route path="subjects" element={<SubjectPage />} />
                        <Route path="assignments" element={<AssignmentPage />} />
                        <Route path="schedules" element={<SchedulePage />} />

                        <Route path="roles" element={<RolePage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;