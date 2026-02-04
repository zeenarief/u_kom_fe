import { useState } from 'react';
import { Plus, Trash2, Search, Briefcase, Eye } from 'lucide-react';
import { useEmployees, useDeleteEmployee } from './employeeQueries';
import type { Employee } from './types';
import Button from '../../components/ui/Button';
import EmployeeFormModal from './EmployeeFormModal';
import EmployeeDetailModal from './EmployeeDetailModal';

import { useDebounce } from '../../hooks/useDebounce';


export default function EmployeePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data: employees, isLoading, isError } = useEmployees(debouncedSearch);
    const deleteMutation = useDeleteEmployee();

    const handleCreate = () => { setEmployeeToEdit(null); setIsFormOpen(true); };
    const handleViewDetail = (id: string) => { setDetailId(id); };
    const handleEditFromDetail = (e: Employee) => { setDetailId(null); setEmployeeToEdit(e); setIsFormOpen(true); };
    const handleDelete = (id: string) => { if (confirm('Yakin hapus data ini?')) deleteMutation.mutate(id); };

    if (isError) return <div className="p-8 text-center text-red-500">Error memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Guru & Tendik</h1>
                    <p className="text-gray-500 text-sm">Manajemen data pegawai sekolah.</p>
                </div>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" /> Tambah Pegawai</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIP..."
                            className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">Jabatan</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td>
                            </tr>
                        )}
                        {employees?.map((e) => (
                            <tr key={e.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-teal-100 flex items-center justify-center text-teal-600"><Briefcase size={16} /></div>
                                        <div>
                                            <div>{e.full_name}</div>
                                            <div className="text-xs text-gray-400">{e.nip || '-'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{e.job_title}</td>
                                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{e.employment_status || '-'}</span></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleViewDetail(e.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Eye size={18} /></button>
                                        <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EmployeeFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} employeeToEdit={employeeToEdit} />
            <EmployeeDetailModal employeeId={detailId} onClose={() => setDetailId(null)} onEdit={handleEditFromDetail} />
        </div>
    );
}