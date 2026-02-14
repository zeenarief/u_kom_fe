import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import type { Classroom, ClassroomFormInput } from './types';

import { useCreateClassroom, useUpdateClassroom } from './classroomQueries';
import { useEmployees } from '../employees/employeeQueries';
import Select from '../../../components/ui/Select';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    dataToEdit?: Classroom | null;
    academicYearId: string;
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
                <Input label="Nama Kelas" placeholder="Kelas 7" {...register('name', { required: 'Wajib diisi' })} error={errors.name?.message} />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Tingkat"
                        {...register('level', { required: 'Wajib dipilih' })}
                        error={errors.level?.message}
                    >
                        <option value="">-- Pilih Tingkat --</option>
                        <option value="1">Marhalah 1</option>
                        <option value="2">Marhalah 2</option>
                        <option value="3">Marhalah 3</option>
                        <option value="7">Kelas 7</option>
                        <option value="8">Kelas 8</option>
                        <option value="9">Kelas 9</option>
                        <option value="10">Kelas 10</option>
                        <option value="11">Kelas 11</option>
                        <option value="12">Kelas 12</option>
                    </Select>
                    <Input label="Jurusan" placeholder="Diniyyah/Umum" {...register('major', { required: 'Wajib diisi' })} error={errors.major?.message} />
                </div>

                <Select
                    label="Wali Kelas"
                    {...register('homeroom_teacher_id', { required: 'Wajib dipilih' })}
                    error={errors.homeroom_teacher_id?.message}
                >
                    <option value="">-- Pilih Guru --</option>
                    {employees?.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.full_name} ({emp.nip || '-'})
                        </option>
                    ))}
                </Select>


                <Input label="Deskripsi (Opsional)" {...register('description')} />

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}