import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type {Role} from '../../types/api';
import { useCreateRole, useUpdateRole } from './roleQueries';

interface RoleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleToEdit?: Role | null; // Jika null = Mode Create, Jika ada object = Mode Edit
}

interface RoleFormInput {
    name: string;
    description: string;
}

export default function RoleFormModal({ isOpen, onClose, roleToEdit }: RoleFormModalProps) {
    const isEditMode = !!roleToEdit;

    const createMutation = useCreateRole(onClose);
    const updateMutation = useUpdateRole(onClose);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RoleFormInput>();

    // Efek: Isi form jika mode Edit
    useEffect(() => {
        if (isOpen) {
            if (roleToEdit) {
                setValue('name', roleToEdit.name);
                setValue('description', roleToEdit.description || '');
            } else {
                reset({ name: '', description: '' });
            }
        }
    }, [isOpen, roleToEdit, setValue, reset]);

    const onSubmit = (data: RoleFormInput) => {
        if (isEditMode && roleToEdit) {
            updateMutation.mutate({ id: roleToEdit.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Role" : "Buat Role Baru"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nama Role"
                    placeholder="Contoh: Staff Perpustakaan"
                    error={errors.name?.message}
                    {...register('name', { required: 'Nama Role wajib diisi' })}
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
                        placeholder="Jelaskan fungsi role ini..."
                        {...register('description')}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditMode ? 'Simpan Perubahan' : 'Buat Role'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}