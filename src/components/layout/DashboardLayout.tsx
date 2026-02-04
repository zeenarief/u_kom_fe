import { Outlet } from 'react-router-dom';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Fixed to top */}
            <Header />

            {/* Main Content Wrapper */}
            <main className="pt-20 px-6 pb-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;