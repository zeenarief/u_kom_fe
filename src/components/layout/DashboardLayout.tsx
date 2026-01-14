import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar - Fixed di kiri */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="md:ml-64 transition-all duration-300">

                {/* Header - Fixed di atas */}
                <Header />

                {/* Dynamic Content - Berubah sesuai Route */}
                <main className="pt-20 px-6 pb-8 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;