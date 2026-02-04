import { Edit, User, ShieldCheck, Unlink, Briefcase } from 'lucide-react';
import { formatDate } from '../../lib/date';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useEmployeeDetail, useUnlinkEmployeeFromUser } from './employeeQueries';
import type { Employee } from './types';
import EmployeeUserLinker from './EmployeeUserLinker';

interface Props {
    employeeId: string | null;
    onClose: () => void;
    onEdit: (e: Employee) => void;
}

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

export default function EmployeeDetailModal({ employeeId, onClose, onEdit }: Props) {
    const { data: employee, isLoading, isError } = useEmployeeDetail(employeeId);
    const unlinkMutation = useUnlinkEmployeeFromUser();

    const handleUnlink = () => {
        if (!employee) return;
        if (confirm(`Putuskan akun ${employee.user?.username}?`)) unlinkMutation.mutate(employee.id);
    };

    if (isLoading && employeeId) return <Modal isOpen={!!employeeId} onClose={onClose} title="Loading..."><div className="p-8 text-center">Mengambil data...</div></Modal>;
    if (isError || !employee) return null;

    return (
        <Modal isOpen={!!employeeId} onClose={onClose} title="Detail Pegawai">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

                {/* Header Profile */}
                <div className="bg-teal-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center text-teal-700 font-bold text-2xl">
                        {employee.full_name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{employee.full_name}</h2>
                        <div className="flex gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold uppercase">{employee.job_title}</span>
                            {employee.nip && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">NIP: {employee.nip}</span>}
                        </div>
                    </div>
                </div>

                {/* Section Akun Sistem */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b"><ShieldCheck size={18} className="text-teal-500" /> Akun Sistem</h3>
                    {employee.user ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                    {employee.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">Terhubung</p>
                                    <p className="text-sm text-green-700">User: <span className="font-mono">{employee.user.username}</span></p>
                                </div>
                            </div>
                            <button onClick={handleUnlink} disabled={unlinkMutation.isPending} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Unlink size={18} /></button>
                        </div>
                    ) : (
                        <EmployeeUserLinker employeeId={employee.id} />
                    )}
                </div>

                {/* Kepegawaian */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b"><Briefcase size={18} className="text-teal-500" /> Data Kepegawaian</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                        <DetailRow label="Status" value={employee.employment_status} />
                        <DetailRow label="Tanggal Masuk" value={formatDate(employee.join_date)} />
                        <DetailRow label="NIP" value={employee.nip} />
                        <DetailRow label="NIK" value={employee.nik} />
                    </div>
                </div>

                {/* Pribadi */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b"><User size={18} className="text-teal-500" /> Data Pribadi</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Gender" value={employee.gender === 'male' ? 'Laki-laki' : 'Perempuan'} />
                        <DetailRow label="Tanggal Lahir" value={formatDate(employee.date_of_birth)} />
                        <DetailRow label="No. HP" value={employee.phone_number} />
                        <DetailRow label="Alamat" value={employee.address} />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="ghost" onClick={onClose}>Tutup</Button>
                    <Button onClick={() => onEdit(employee)}><Edit size={16} className="mr-2" />Edit Data</Button>
                </div>
            </div>
        </Modal>
    );
}