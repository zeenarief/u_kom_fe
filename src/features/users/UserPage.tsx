import { useState } from 'react';
import { Plus, Trash2, Search, Eye } from 'lucide-react';
import { useUsers, useDeleteUser } from './userQueries';
import type {User} from '../../types/api';
import Button from '../../components/ui/Button';
import UserFormModal from './UserFormModal';
import UserDetailModal from './UserDetailModal';

export default function UserPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const { data: users, isLoading, isError } = useUsers();
    const deleteMutation = useDeleteUser();

    // -- Handlers --
    const handleCreate = () => {
        setUserToEdit(null);
        setIsFormOpen(true);
    };

    const handleViewDetail = (id: string) => {
        setDetailId(id);
    };

    const handleEditFromDetail = (user: User) => {
        setDetailId(null); // Tutup detail
        setUserToEdit(user); // Set data edit
        setIsFormOpen(true); // Buka form
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading data users...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                    <p className="text-gray-500 text-sm">Kelola akun akses untuk sistem sekolah.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah User
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari user..."
                            className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">User Info</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users?.map((user) => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles?.map(role => (
                                            <span key={role.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">
                                              {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Ubah tombol Edit jadi Eye */}
                                        <button
                                            onClick={() => handleViewDetail(user.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODALS */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                userToEdit={userToEdit}
            />

            <UserDetailModal
                userId={detailId}
                onClose={() => setDetailId(null)}
                onEdit={handleEditFromDetail}
            />
        </div>
    );
}