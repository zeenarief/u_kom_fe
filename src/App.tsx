import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AlertModal from './components/ui/AlertModal';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './store/authStore';
import type { JSX } from "react";
import UserPage from "./features/admin/users/UserPage";
import StudentPage from "./features/admin/students/StudentPage";
import StudentDetailPage from "./features/admin/students/StudentDetailPage";
import StudentCreatePage from "./features/admin/students/StudentCreatePage";
import StudentEditPage from "./features/admin/students/StudentEditPage";
import RolePage from "./features/admin/roles/RolePage";
import ParentPage from "./features/admin/parents/ParentPage.tsx";
import ParentCreatePage from "./features/admin/parents/ParentCreatePage.tsx";
import ParentDetailPage from "./features/admin/parents/ParentDetailPage.tsx";
import ParentEditPage from "./features/admin/parents/ParentEditPage.tsx";
import GuardianPage from "./features/admin/guardians/GuardianPage.tsx";
import GuardianCreatePage from "./features/admin/guardians/GuardianCreatePage.tsx";
import GuardianDetailPage from "./features/admin/guardians/GuardianDetailPage.tsx";
import GuardianEditPage from "./features/admin/guardians/GuardianEditPage.tsx";
import EmployeePage from "./features/admin/employees/EmployeePage.tsx";
import EmployeeCreatePage from "./features/admin/employees/EmployeeCreatePage.tsx";
import EmployeeDetailPage from "./features/admin/employees/EmployeeDetailPage.tsx";
import EmployeeEditPage from "./features/admin/employees/EmployeeEditPage.tsx";
import DashboardHome from "./features/dashboard/DashboardHome.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AcademicYearPage from "./features/admin/academic-years/AcademicYearPage.tsx";
import ClassroomPage from "./features/admin/classrooms/ClassroomPage.tsx";
import SubjectPage from "./features/admin/subjects/SubjectPage.tsx";
import AssignmentPage from "./features/admin/assignments/AssignmentPage.tsx";
import SchedulePage from "./features/admin/schedules/SchedulePage.tsx";
import ProfilePage from "./features/profile/ProfilePage.tsx";
import TeacherClassesPage from "./features/teacher/TeacherClassesPage.tsx";
import TeacherGradePage from "./features/teacher/TeacherGradePage.tsx";
import TeacherAttendancePage from "./features/teacher/TeacherAttendancePage.tsx";
import TeacherScoreInputPage from "./features/teacher/TeacherScoreInputPage.tsx";
import TeacherSchedulePage from "./features/teacher/TeacherSchedulePage.tsx";
import TeacherAttendanceInputPage from "./features/teacher/TeacherAttendanceInputPage.tsx";
const ScheduleWrapper = () => {
    const { activeRole } = useAuthStore();
    return activeRole === 'teacher' ? <TeacherSchedulePage /> : <SchedulePage />;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

function App() {
    const { isAuthenticated, user, ensureActiveRole } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            ensureActiveRole();
        }
    }, [isAuthenticated, user, ensureActiveRole]);

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
                        <Route path="schedules" element={<ScheduleWrapper />} />

                        <Route path="roles" element={<RolePage />} />
                        <Route path="profile" element={<ProfilePage />} />

                        {/* Teacher Routes */}
                        <Route path="classes" element={<TeacherClassesPage />} />
                        <Route path="grades" element={<TeacherClassesPage />} /> {/* Entry point for grades */}
                        <Route path="grades/:assignmentId" element={<TeacherGradePage />} />
                        <Route path="grades/assessment/:assessmentId" element={<TeacherScoreInputPage />} />
                        <Route path="attendance" element={<TeacherClassesPage />} /> {/* Entry point for attendance */}
                        <Route path="attendance/:assignmentId" element={<TeacherAttendancePage />} />
                        <Route path="attendance/:assignmentId/input" element={<TeacherAttendanceInputPage />} />
                    </Route>

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;