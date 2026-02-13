import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { User } from './types';

import { useCreateUser, useUpdateUser, useRoles, type UpdateUserPayload } from './userQueries';

interface UserFormInput {
    name: string;
    username: string;
    email: string;
    password?: string; // Opsional di form
    role_ids: string[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userToEdit?: User | null;
}

export default function UserFormModal({ isOpen, onClose, userToEdit }: Props) {
    const isEditMode = !!userToEdit;
    const { data: roles } = useRoles();

    const createMutation = useCreateUser(onClose);
    const updateMutation = useUpdateUser(onClose);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<UserFormInput>({
        defaultValues: {
            role_ids: []
        }
    });

    // Populate data saat Edit Mode
    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setValue('name', userToEdit.name);
                setValue('username', userToEdit.username);
                setValue('email', userToEdit.email);

                // Ambil semua role ID dan masukkan ke form
                // Ambil semua role ID dan masukkan ke form
                if (userToEdit.roles && userToEdit.roles.length > 0 && roles) {
                    const currentRoleIds = roles
                        .filter(r => userToEdit.roles.includes(r.name))
                        .map(r => r.id);
                    setValue('role_ids', currentRoleIds);
                } else {
                    setValue('role_ids', []);
                }

                setValue('password', ''); // Kosongkan password saat edit
            } else {
                reset({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    role_ids: []
                });
            }
        }
    }, [isOpen, userToEdit, setValue, reset, roles]);

    const onSubmit: SubmitHandler<UserFormInput> = (data) => {
        // Validasi Manual: Pastikan minimal 1 role dipilih (karena checkbox html kadang tricky)
        if (!data.role_ids || data.role_ids.length === 0) {
            alert("Minimal satu role harus dipilih!");
            return;
        }

        if (isEditMode && userToEdit) {
            // Logic Update
            const payload: UpdateUserPayload = {
                name: data.name,
                username: data.username,
                email: data.email,
                role_ids: data.role_ids // Kirim Array langsung
            };
            if (data.password && data.password.trim() !== '') {
                payload.password = data.password;
            }
            updateMutation.mutate({ id: userToEdit.id, data: payload });
        } else {
            // Logic Create
            createMutation.mutate({
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password || '123456', // Fallback safety
                role_ids: data.role_ids // Kirim Array langsung
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit User" : "Tambah User Baru"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nama Lengkap"
                    {...register('name', { required: 'Nama wajib diisi' })}
                    error={errors.name?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Username"
                        {...register('username', { required: 'Username wajib diisi' })}
                        error={errors.username?.message}
                    />
                    <Input
                        label="Email"
                        type="email"
                        {...register('email', { required: 'Email wajib diisi' })}
                        error={errors.email?.message}
                    />
                </div>

                <div>
                    <Input
                        label={isEditMode ? "Password Baru (Opsional)" : "Password"}
                        type="password"
                        placeholder={isEditMode ? "Biarkan kosong jika tidak diubah" : "Min 6 karakter"}
                        {...register('password', {
                            required: isEditMode ? false : 'Password wajib diisi',
                            minLength: { value: 6, message: 'Min 6 karakter' }
                        })}
                        error={errors.password?.message}
                    />
                </div>

                {/* --- UI MULTI SELECT ROLE (CHECKBOX) --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roles (Hak Akses) <span className="text-red-500">*</span>
                    </label>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto space-y-2">
                        {roles && roles.length > 0 ? (
                            roles.map((role) => (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        value={role.id}
                                        {...register('role_ids', { required: 'Minimal satu role harus dipilih' })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">{role.name}</span>
                                        {/* Optional: Tampilkan deskripsi role jika ada */}
                                        {/* <p className="text-xs text-gray-500">{role.description}</p> */}
                                    </div>
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">Memuat roles...</p>
                        )}
                    </div>
                    {errors.role_ids && <p className="mt-1 text-xs text-red-500">{errors.role_ids.message}</p>}
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}