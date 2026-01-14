import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Plus, Trash2, Pencil, Search, User as UserIcon } from 'lucide-react';
import { useUsers, useCreateUser, useDeleteUser, useRoles } from './userQueries';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// 1. Definisikan Tipe Data Form
interface UserFormInput {
    name: string;
    username: string;
    email: string;
    password: string;
    role_id: string;
}

export default function UserPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Queries
    const { data: users, isLoading, isError } = useUsers();
    const { data: roles } = useRoles();
    const deleteMutation = useDeleteUser();
    const createMutation = useCreateUser(() => setIsModalOpen(false));

    // 2. Pasang generic UserFormInput ke useForm
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors } // Sekarang 'errors' akan kita pakai di bawah
    } = useForm<UserFormInput>();

    // 3. Gunakan SubmitHandler dengan tipe yang benar (Hapus any)
    const onSubmit: SubmitHandler<UserFormInput> = (data) => {
        const payload = {
            ...data,
            role_ids: [data.role_id]
        };
        createMutation.mutate(payload);
        reset();
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
            {/* --- HEADER HALAMAN --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                    <p className="text-gray-500 text-sm">Kelola akun akses untuk sistem sekolah.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah User
                </Button>
            </div>

            {/* --- TABEL --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar Pencarian (Visual Saja Dulu) */}
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
                                            <div className="text-xs text-gray-400">{user.email}</div>
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
                                        {/* Handle jika tidak ada role */}
                                        {(!user.roles || user.roles.length === 0) && <span className="text-xs text-gray-400">-</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  Active
                                </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {users?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    <UserIcon className="mx-auto h-12 w-12 mb-3 opacity-20" />
                                    Belum ada data user.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL FORM TAMBAH USER --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah User Baru"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Nama Lengkap"
                        placeholder="Contoh: Budi Santoso"
                        error={errors.name?.message}
                        {...register('name', { required: 'Nama wajib diisi' })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Username"
                            placeholder="budi.s"
                            error={errors.username?.message}
                            {...register('username', { required: 'Username wajib diisi' })}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@sekolah.com"
                            error={errors.email?.message}
                            {...register('email', { required: 'Email wajib diisi' })}
                        />
                    </div>

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        error={errors.password?.message}
                        {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Min 6 karakter'} })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Awal</label>
                        <select
                            {...register('role_id', { required: 'Role wajib dipilih' })}
                            className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.role_id ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">-- Pilih Role --</option>
                            {roles?.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        {/* Tampilkan error select manual karena select bukan komponen Input custom kita */}
                        {errors.role_id && <p className="mt-1 text-xs text-red-500">{errors.role_id.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            isLoading={createMutation.isPending}
                        >
                            Simpan User
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}