import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmployeeForm from './EmployeeForm';
import { useCreateEmployee } from './employeeQueries';
import type { EmployeeFormInput } from './types';

export default function EmployeeCreatePage() {
    const navigate = useNavigate();
    const createMutation = useCreateEmployee(() => {
        navigate('/dashboard/employees');
    });

    const handleSubmit = (data: EmployeeFormInput) => {
        createMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Pegawai', href: '/dashboard/employees', icon: Users },
                                { label: 'Tambah Baru', icon: Plus }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <EmployeeForm
                            onSubmit={handleSubmit}
                            isLoading={createMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
