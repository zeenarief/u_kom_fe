import { useNavigate, useParams } from 'react-router-dom';
import { Users, Edit as EditIcon } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import EmployeeForm from './EmployeeForm';
import { useEmployeeDetail, useUpdateEmployee } from './employeeQueries';
import type { EmployeeFormInput } from './types';

export default function EmployeeEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Get employee data
    const { data: employee, isLoading } = useEmployeeDetail(id || null);

    const updateMutation = useUpdateEmployee(() => {
        navigate(`/dashboard/employees/${id}`);
    });

    const handleSubmit = (data: EmployeeFormInput) => {
        if (id) {
            updateMutation.mutate({ id, data });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
                    <p className="text-gray-500">Memuat data pegawai...</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Data pegawai tidak ditemukan.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Pegawai', href: '/dashboard/employees', icon: Users },
                                { label: employee.full_name, href: `/dashboard/employees/${id}` },
                                { label: 'Edit', icon: EditIcon }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <EmployeeForm
                            initialData={employee}
                            onSubmit={handleSubmit}
                            isLoading={updateMutation.isPending}
                            isEditMode={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
