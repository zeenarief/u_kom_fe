import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { AcademicYear, AcademicYearFormInput } from './types';
import { useCreateAcademicYear, useUpdateAcademicYear } from './academicYearQueries';

interface FormProps {
    isOpen: boolean;
    onClose: () => void;
    dataToEdit?: AcademicYear | null;
}

export default function AcademicYearFormModal({ isOpen, onClose, dataToEdit }: FormProps) {
    const isEdit = !!dataToEdit;

    const createMutation = useCreateAcademicYear(onClose);
    const updateMutation = useUpdateAcademicYear(onClose);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AcademicYearFormInput>();

    useEffect(() => {
        if (isOpen) {
            if (dataToEdit) {
                setValue('name', dataToEdit.name);
                // Format tanggal dari backend (ISO) ke HTML Input Date (YYYY-MM-DD)
                if (dataToEdit.start_date) setValue('start_date', dataToEdit.start_date.split('T')[0]);
                if (dataToEdit.end_date) setValue('end_date', dataToEdit.end_date.split('T')[0]);
            } else {
                reset({});
            }
        }
    }, [isOpen, dataToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<AcademicYearFormInput> = (data) => {
        if (isEdit && dataToEdit) {
            updateMutation.mutate({ id: dataToEdit.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nama Tahun Ajaran"
                    placeholder="Contoh: 2024/2025 Ganjil"
                    {...register('name', { required: 'Nama wajib diisi' })}
                    error={errors.name?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Tanggal Mulai"
                        type="date"
                        {...register('start_date', { required: 'Wajib diisi' })}
                        error={errors.start_date?.message}
                    />
                    <Input
                        label="Tanggal Selesai"
                        type="date"
                        {...register('end_date', { required: 'Wajib diisi' })}
                        error={errors.end_date?.message}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}