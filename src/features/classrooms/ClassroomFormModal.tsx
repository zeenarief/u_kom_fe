import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Classroom, ClassroomFormInput } from '../../types/api';
import { useCreateClassroom, useUpdateClassroom } from './classroomQueries';
import { useEmployees } from '../employees/employeeQueries'; // Asumsi Anda sudah punya ini

interface Props {
    isOpen: boolean;
    onClose: () => void;
    dataToEdit?: Classroom | null;
    academicYearId: string; // Kita butuh ID tahun ajaran yang sedang aktif dipilih
}

export default function ClassroomFormModal({ isOpen, onClose, dataToEdit, academicYearId }: Props) {
    const isEdit = !!dataToEdit;
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClassroomFormInput>();

    // Fetch Guru untuk Dropdown Wali Kelas
    const { data: employees } = useEmployees();

    const createMutation = useCreateClassroom(onClose);
    const updateMutation = useUpdateClassroom(onClose);

    useEffect(() => {
        if (isOpen) {
            if (dataToEdit) {
                setValue('name', dataToEdit.name);
                setValue('level', dataToEdit.level);
                setValue('major', dataToEdit.major);
                setValue('description', dataToEdit.description);

                // PERBAIKAN: Set Homeroom Teacher ID
                if (dataToEdit.homeroom_teacher_id) {
                    setValue('homeroom_teacher_id', dataToEdit.homeroom_teacher_id);
                } else {
                    setValue('homeroom_teacher_id', ""); // Reset jika kosong
                }

            } else {
                // Reset form saat mode create
                reset({
                    academic_year_id: academicYearId,
                    homeroom_teacher_id: "" // Pastikan default string kosong
                });
            }
        }
    }, [isOpen, dataToEdit, academicYearId, reset, setValue]);

    const onSubmit: SubmitHandler<ClassroomFormInput> = (data) => {
        // Pastikan academic_year_id terisi
        data.academic_year_id = academicYearId;

        if (isEdit && dataToEdit) {
            updateMutation.mutate({ id: dataToEdit.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Kelas" : "Buat Kelas Baru"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Nama Kelas" placeholder="X-IPA-1" {...register('name', { required: 'Wajib diisi' })} error={errors.name?.message} />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
                        <select {...register('level', { required: true })} className="w-full px-4 py-2 border rounded-lg bg-white">
                            <option value="7">Kelas 7</option>
                            <option value="8">Kelas 8</option>
                            <option value="9">Kelas 9</option>
                            <option value="10">Kelas 10</option>
                            <option value="11">Kelas 11</option>
                            <option value="12">Kelas 12</option>
                        </select>
                    </div>
                    <Input label="Jurusan" placeholder="IPA/IPS/Umum" {...register('major')} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wali Kelas</label>
                    <select {...register('homeroom_teacher_id')} className="w-full px-4 py-2 border rounded-lg bg-white">
                        <option value="">-- Pilih Guru --</option>
                        {employees?.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.nip || '-'})</option>
                        ))}
                    </select>
                </div>

                <Input label="Deskripsi (Opsional)" {...register('description')} />

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}