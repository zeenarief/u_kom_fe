import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { User } from '../../types/api';
import { useCreateUser, useUpdateUser, useRoles, type UpdateUserPayload } from './userQueries';

interface UserFormInput {
    name: string;
    username: string;
    email: string;
    password?: string; // Opsional di form
    role_id: string; // Kita pakai single select dulu untuk UI sederhana
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
    } = useForm<UserFormInput>();

    // Populate data saat Edit Mode
    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setValue('name', userToEdit.name);
                setValue('username', userToEdit.username);
                setValue('email', userToEdit.email);
                // Ambil role pertama jika ada
                if (userToEdit.roles && userToEdit.roles.length > 0) {
                    setValue('role_id', userToEdit.roles[0].id);
                }
                setValue('password', ''); // Kosongkan password saat edit
            } else {
                reset({ name: '', username: '', email: '', password: '', role_id: '' });
            }
        }
    }, [isOpen, userToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<UserFormInput> = (data) => {
        if (isEditMode && userToEdit) {
            // Logic Update
            const payload: UpdateUserPayload = {
                name: data.name,
                username: data.username,
                email: data.email,
                role_ids: [data.role_id]
            };
            // Hanya kirim password jika diisi
            if (data.password && data.password.trim() !== '') {
                payload.password = data.password;
            }
            updateMutation.mutate({ id: userToEdit.id, data: payload });
        } else {
            // Logic Create
            if (!data.password) return; // Seharusnya dicegah validasi form
            createMutation.mutate({
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
                role_ids: [data.role_id]
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
                    {isEditMode && <p className="text-xs text-gray-500 mt-1">Isi hanya jika ingin mereset password user ini.</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        {...register('role_id', { required: 'Role wajib dipilih' })}
                        className="w-full px-4 py-2 bg-white border rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">-- Pilih Role --</option>
                        {roles?.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                    {errors.role_id && <p className="mt-1 text-xs text-red-500">{errors.role_id.message}</p>}
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}