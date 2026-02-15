import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AlertModal from './components/ui/AlertModal';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './store/authStore';
import type { JSX } from "react";
import RoleGuard from './components/auth/RoleGuard';

// Feature Pages
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

// Teacher Pages
import TeacherClassesPage from "./features/teacher/TeacherClassesPage.tsx";
import TeacherGradePage from "./features/teacher/TeacherGradePage.tsx";
import TeacherAttendancePage from "./features/teacher/TeacherAttendancePage.tsx";
import TeacherScoreInputPage from "./features/teacher/TeacherScoreInputPage.tsx";
import TeacherSchedulePage from "./features/teacher/TeacherSchedulePage.tsx";
import TeacherAttendanceInputPage from "./features/teacher/TeacherAttendanceInputPage.tsx";
import TeacherClassLayout from "./features/teacher/TeacherClassLayout.tsx";

// Musyrif Pages
import ViolationInputForm from "./features/musyrif/violations/ViolationInputForm.tsx";
import ViolationHistory from "./features/musyrif/violations/ViolationHistory.tsx";
import ViolationMasterData from "./features/musyrif/violations/master/ViolationMasterData.tsx";

// Finance/Fundraiser Pages
import DonationCreatePage from "./features/finance/donations/DonationCreatePage.tsx";
import DonationPage from "./features/finance/donations/DonationPage.tsx";
import DonationEditPage from "./features/finance/donations/DonationEditPage.tsx";
import DonationDetailPage from "./features/finance/donations/DonationDetailPage.tsx";
import DonorPage from "./features/finance/donors/DonorPage.tsx";
import DonorCreatePage from "./features/finance/donors/DonorCreatePage.tsx";
import DonorEditPage from "./features/finance/donors/DonorEditPage.tsx";
import DonorDetailPage from "./features/finance/donors/DonorDetailPage.tsx";

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
                        {/* Index Route: Dashboard Home (Role based dispatcher) */}
                        <Route index element={<DashboardHome />} />

                        {/* Shared/Common Routes */}
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="assignments" element={<AssignmentPage />} />
                        <Route path="schedules" element={<ScheduleWrapper />} />

                        {/* Admin Only Routes */}
                        <Route element={<RoleGuard allowedRoles={['admin']} />}>
                            <Route path="users" element={<UserPage />} />
                            <Route path="roles" element={<RolePage />} />

                            {/* Academic Data */}
                            <Route path="academic-years" element={<AcademicYearPage />} />
                            <Route path="classrooms" element={<ClassroomPage />} />
                            <Route path="subjects" element={<SubjectPage />} />

                            {/* People Management */}
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
                        </Route>


                        {/* Musyrif Routes */}
                        <Route element={<RoleGuard allowedRoles={['musyrif', 'admin']} />}>
                            <Route path="violations/record" element={<ViolationInputForm />} />
                            <Route path="violations/history" element={<ViolationHistory />} />
                            <Route path="violations/master" element={<ViolationMasterData />} />
                        </Route>

                        {/* Fundraiser/Finance Routes */}
                        <Route element={<RoleGuard allowedRoles={['fundraiser', 'admin', 'finance_admin']} />}>
                            <Route path="finance/donations/create" element={<DonationCreatePage />} />
                            <Route path="finance/donations/history" element={<DonationPage />} />
                            <Route path="finance/donations/:id" element={<DonationDetailPage />} />
                            <Route path="finance/donations/:id/edit" element={<DonationEditPage />} />
                            <Route path="finance/donors" element={<DonorPage />} />
                            <Route path="finance/donors/create" element={<DonorCreatePage />} />
                            <Route path="finance/donors/:id" element={<DonorDetailPage />} />
                            <Route path="finance/donors/:id/edit" element={<DonorEditPage />} />
                        </Route>



                        {/* Teacher Routes - Partially protected by layout, but adding explicit guard is better */}
                        <Route element={<RoleGuard allowedRoles={['teacher', 'guru', 'admin']} />}>
                            {/* Note: Admin usually can access teacher pages too, or maybe not. 
                                Keeping admin here just in case they need to view. 
                                If not, remove 'admin'. TeacherClassLayout might also handle it.
                            */}
                            <Route path="classes" element={<TeacherClassesPage />} />
                            <Route path="grades" element={<TeacherClassesPage />} />
                            <Route path="attendance" element={<TeacherClassesPage />} />

                            {/* Class Specific Routes */}
                            <Route path="class/:assignmentId" element={<TeacherClassLayout />}>
                                <Route path="attendance" element={<TeacherAttendancePage />} />
                                <Route path="grades" element={<TeacherGradePage />} />
                            </Route>

                            <Route path="grades/assessment/:assessmentId" element={<TeacherScoreInputPage />} />
                            <Route path="class/:assignmentId/attendance/input" element={<TeacherAttendanceInputPage />} />
                        </Route>

                    </Route>

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;