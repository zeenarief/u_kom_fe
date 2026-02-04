import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Employee, EmployeeFormInput } from './types';
import { useCreateEmployee, useUpdateEmployee } from './employeeQueries';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employeeToEdit?: Employee | null;
}

export default function EmployeeFormModal({ isOpen, onClose, employeeToEdit }: Props) {
    const isEditMode = !!employeeToEdit;
    const createMutation = useCreateEmployee(onClose);
    const updateMutation = useUpdateEmployee(onClose);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmployeeFormInput>();

    useEffect(() => {
        if (isOpen) {
            if (employeeToEdit) {
                // Isi form saat edit
                const fields: (keyof EmployeeFormInput)[] = ['full_name', 'nip', 'job_title', 'nik', 'gender', 'phone_number', 'address', 'employment_status'];
                fields.forEach(f => setValue(f, employeeToEdit[f as keyof Employee] as string));
                // Handle Tanggal
                if (employeeToEdit.date_of_birth) setValue('date_of_birth', employeeToEdit.date_of_birth.split('T')[0]);
                if (employeeToEdit.join_date) setValue('join_date', employeeToEdit.join_date.split('T')[0]);
            } else {
                reset({});
            }
        }
    }, [isOpen, employeeToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<EmployeeFormInput> = (data) => {
        // Pastikan string kosong dikirim sebagai undefined atau null jika perlu,
        // tapi backend Go biasanya handle empty string ok.
        // Format tanggal ISO
        const payload = { ...data };
        // Backend now accepts YYYY-MM-DD directly


        if (isEditMode && employeeToEdit) {
            updateMutation.mutate({ id: employeeToEdit.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Pegawai" : "Tambah Pegawai"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

                <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="NIP" {...register('nip')} placeholder="Kosongi jika tidak ada" />
                    <Input label="Jabatan" {...register('job_title', { required: 'Wajib diisi' })} placeholder="Guru Mapel / Staff TU" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="NIK" {...register('nik')} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Kepegawaian</label>
                        <select {...register('employment_status')} className="w-full px-4 py-2 border rounded-lg bg-white">
                            <option value="">- Pilih -</option>
                            <option value="PNS">PNS</option>
                            <option value="PPPK">PPPK</option>
                            <option value="GTY">GTY (Tetap Yayasan)</option>
                            <option value="GTT">GTT (Tidak Tetap)</option>
                            <option value="Honor">Honorer</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select {...register('gender')} className="w-full px-4 py-2 border rounded-lg bg-white">
                            <option value="">- Pilih -</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                        </select>
                    </div>
                    <Input label="No. HP" {...register('phone_number')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Tanggal Lahir" type="date" {...register('date_of_birth')} />
                    <Input label="Tanggal Masuk" type="date" {...register('join_date')} />
                </div>

                <Input label="Alamat" {...register('address')} />

                <div className="pt-4 flex justify-end gap-2 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}