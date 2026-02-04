import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Student, StudentFormInput } from './types';
import { useCreateStudent, useUpdateStudent } from './studentQueries';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentToEdit?: Student | null;
}

export default function StudentFormModal({ isOpen, onClose, studentToEdit }: StudentFormModalProps) {
    const isEditMode = !!studentToEdit;

    const createMutation = useCreateStudent(onClose);
    const updateMutation = useUpdateStudent(onClose);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<StudentFormInput>();

    // Efek: Isi form jika mode Edit
    useEffect(() => {
        if (isOpen) {
            if (studentToEdit) {
                // 1. Kita definisikan field apa saja yang valid untuk Form ini (Whitelist)
                // Ini menghilangkan Error TS2367 karena kita tidak akan menyentuh 'created_at' dkk.
                const fields: (keyof StudentFormInput)[] = [
                    'full_name', 'nisn', 'nim', 'gender', 'place_of_birth',
                    'date_of_birth', 'address', 'no_kk', 'nik', 'rt', 'rw',
                    'sub_district', 'district', 'city', 'province', 'postal_code'
                ];

                fields.forEach((field) => {
                    // Ambil value dari object studentToEdit
                    // Kita casting key-nya agar TypeScript yakin ini aman
                    let value = studentToEdit[field as keyof Student];

                    // Logic Tanggal: Backend "2010-05-15T00:00:00Z" -> HTML Input "2010-05-15"
                    if (field === 'date_of_birth' && typeof value === 'string') {
                        value = value.split('T')[0];
                    }

                    // Atasi Error 'any':
                    // Kita beritahu TS bahwa value ini pasti string atau undefined (sesuai tipe StudentFormInput)
                    setValue(field, value as string | undefined);
                });

            } else {
                // Mode Create: Reset form jadi kosong
                reset({});
            }
        }
    }, [isOpen, studentToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<StudentFormInput> = (data) => {
        // 1. Payload Date Only (YYYY-MM-DD) - Kirim apa adanya
        const payload = { ...data };

        // 2. Kirim Request


        // 2. Kirim Request
        if (isEditMode && studentToEdit) {
            updateMutation.mutate({ id: studentToEdit.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Data Siswa" : "Tambah Siswa Baru"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

                {/* --- SECTION 1: DATA PRIBADI --- */}
                <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-3">
                    Data Pribadi & Identitas
                </div>

                <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="NIK" {...register('nik')} placeholder="16 digit NIK" />
                    <Input label="No. KK" {...register('no_kk')} placeholder="16 digit KK" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="NISN" {...register('nisn')} />
                    <Input label="NIM" {...register('nim')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select {...register('gender')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none">
                            <option value="">- Pilih -</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                        </select>
                    </div>
                    <Input label="Tanggal Lahir" type="date" {...register('date_of_birth')} />
                </div>
                <Input label="Tempat Lahir" {...register('place_of_birth')} />

                {/* --- SECTION 2: ALAMAT --- */}
                <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-3 mt-6">
                    Alamat Domisili
                </div>

                <Input label="Jalan / Alamat" {...register('address')} placeholder="Jl. Mawar No. 12" />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="RT" {...register('rt')} maxLength={3} />
                    <Input label="RW" {...register('rw')} maxLength={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Kelurahan" {...register('sub_district')} />
                    <Input label="Kecamatan" {...register('district')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Kota/Kab" {...register('city')} />
                    <Input label="Provinsi" {...register('province')} />
                </div>
                <Input label="Kode Pos" {...register('postal_code')} />

                {/* FOOTER BUTTONS */}
                <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan Data</Button>
                </div>
            </form>
        </Modal>
    );
}