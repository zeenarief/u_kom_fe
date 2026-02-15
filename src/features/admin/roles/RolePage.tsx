import { useState } from 'react';
import { Shield, Check, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useRoles, usePermissions, useRoleDetail, useSyncRolePermissions, useDeleteRole } from './roleQueries';
import { useAlertStore } from '../../../store/alertStore';
import type { Role, Permission, RoleDetail } from './types';
import Button from '../../../components/ui/Button';
import RoleFormModal from './RoleFormModal';

// === SUB-KOMPONEN: FORM PERMISSION (Bagian Kanan) ===
// Kita pisah komponen ini agar State-nya bisa di-reset otomatis menggunakan 'key'
interface PermissionFormProps {
    role: RoleDetail;
    allPermissions: Permission[];
    onSave: (roleId: string, perms: string[]) => void;
    isSaving: boolean;
}

const RolePermissionForm = ({ role, allPermissions, onSave, isSaving }: PermissionFormProps) => {
    // State inisialisasi langsung dari props.
    // Tidak perlu useEffect karena komponen ini akan di-remount saat 'key' di parent berubah.
    const [selectedPerms, setSelectedPerms] = useState<string[]>(
        (role.permissions || []).map(p => p.name)
    );

    const togglePermission = (permName: string) => {
        setSelectedPerms(prev =>
            prev.includes(permName)
                ? prev.filter(p => p !== permName) // Uncheck
                : [...prev, permName]              // Check
        );
    };

    // Grouping Permission
    const groupedPermissions = allPermissions.reduce((acc, perm) => {
        const group = perm.name.split('.')[0].toUpperCase();
        if (!acc[group]) acc[group] = [];
        acc[group].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">
                    Izin Akses untuk: <span className="text-blue-600">{role.name}</span>
                </h3>
                <Button
                    onClick={() => onSave(role.id, selectedPerms)}
                    isLoading={isSaving}
                >
                    <Save size={16} className="mr-2" />
                    Simpan Perubahan
                </Button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                        <div key={group} className="border border-gray-100 rounded-lg p-4 shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-3 border-b pb-2 text-xs tracking-wider">
                                MODUL {group}
                            </h4>
                            <div className="space-y-2">
                                {perms.map((perm) => (
                                    <label key={perm.id} className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={selectedPerms.includes(perm.name)}
                                                onChange={() => togglePermission(perm.name)}
                                            />
                                            <div className="w-4 h-4 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                                            <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none top-[1px] left-[1px]" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                                {perm.name}
                                            </span>
                                            <p className="text-xs text-gray-400">{perm.description || 'Tidak ada deskripsi'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


// === KOMPONEN UTAMA ===
export default function RolePage() {
    const { showAlert } = useAlertStore();
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

    // State untuk Modal CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

    // Queries
    const { data: roles, isLoading: loadingRoles } = useRoles();
    const { data: allPermissions, isLoading: loadingPerms } = usePermissions();
    const { data: roleDetail, isLoading: loadingDetail } = useRoleDetail(selectedRoleId);

    const syncMutation = useSyncRolePermissions();
    const deleteMutation = useDeleteRole();

    // Handlers CRUD
    const handleCreate = () => {
        setRoleToEdit(null); // Mode Create
        setIsModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, role: Role) => {
        e.stopPropagation(); // Agar tidak men-trigger select role di list
        setRoleToEdit(role); // Mode Edit
        setIsModalOpen(true);
    };

    const handleDelete = (e: React.MouseEvent, roleId: string) => {
        e.stopPropagation();
        showAlert(
            'Konfirmasi Hapus Role',
            'Hapus role ini? User dengan role ini akan kehilangan akses.',
            'warning',
            () => {
                deleteMutation.mutate(roleId);
                if (selectedRoleId === roleId) setSelectedRoleId(null);
            },
            () => { }
        );
    };

    const handleSavePerms = (roleId: string, permissions: string[]) => {
        syncMutation.mutate({ roleId, permissions });
    };

    if (loadingRoles || loadingPerms) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Role & Izin Akses</h1>
                    <p className="text-gray-500 text-sm">Atur jabatan dan hak akses sistem.</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">

                {/* === KOLOM KIRI: LIST ROLE === */}
                <div className="w-1/3 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                    {/* Header Kolom Kiri */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Daftar Jabatan</span>
                        <button
                            onClick={handleCreate}
                            className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-md transition-colors"
                            title="Buat Role Baru"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {roles?.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRoleId(role.id)}
                                className={`group w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer border ${selectedRoleId === role.id
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'hover:bg-gray-50 text-gray-700 border-transparent'
                                    } `}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Shield size={18} className={`shrink-0 ${selectedRoleId === role.id ? 'fill-blue-200' : ''} `} />
                                    <div className="truncate">
                                        <p className="font-medium text-sm">{role.description}</p>
                                        {/* Tampilkan deskripsi pendek jika ada */}
                                        {role.description && <p className="text-xs text-gray-400 truncate">{role.name}</p>}
                                    </div>
                                </div>

                                {/* Action Buttons (Muncul saat hover atau active) */}
                                <div className={`flex items-center gap-1 ${selectedRoleId === role.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                    <button
                                        onClick={(e) => handleEdit(e, role)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded shadow-sm"
                                        title="Edit Nama Role"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    {!role.is_default && ( // Jangan izinkan hapus role default (Admin/User) jika backend support flag ini
                                        <button
                                            onClick={(e) => handleDelete(e, role.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded shadow-sm"
                                            title="Hapus Role"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* === KOLOM KANAN: EDITOR PERMISSION === */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col relative">
                    {!selectedRoleId ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
                            <Shield size={48} className="opacity-20" />
                            <p>Pilih Role di kiri untuk mengatur izin, atau buat Role baru.</p>
                        </div>
                    ) : loadingDetail ? (
                        <div className="text-center py-10 text-gray-500">Memuat detail role...</div>
                    ) : roleDetail && allPermissions ? (
                        <RolePermissionForm
                            key={roleDetail.id}
                            role={roleDetail}
                            allPermissions={allPermissions}
                            onSave={handleSavePerms}
                            isSaving={syncMutation.isPending}
                        />
                    ) : (
                        <div className="text-center py-10 text-red-500">Gagal memuat data role.</div>
                    )}
                </div>
            </div>

            {/* MODAL Create/Edit Role */}
            <RoleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roleToEdit={roleToEdit}
            />
        </div>
    );
}