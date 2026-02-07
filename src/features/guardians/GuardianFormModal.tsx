import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Guardian, GuardianFormInput } from './types';
import { useCreateGuardian, useUpdateGuardian } from './guardianQueries';

interface GuardianFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    guardianToEdit?: Guardian | null;
}

export default function GuardianFormModal({ isOpen, onClose, guardianToEdit }: GuardianFormModalProps) {
    const isEditMode = !!guardianToEdit;
    const createMutation = useCreateGuardian(onClose);
    const updateMutation = useUpdateGuardian(onClose);

    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm<GuardianFormInput>();

    useEffect(() => {
        if (isOpen) {
            if (guardianToEdit) {
                // Whitelist field yang mau diedit
                const fields: (keyof GuardianFormInput)[] = [
                    'full_name', 'nik', 'gender', 'phone_number', 'email',
                    'relationship_to_student',
                    'address', 'rt', 'rw', 'sub_district', 'district', 'city', 'province', 'postal_code'
                ];
                fields.forEach(f => {
                    const val = guardianToEdit[f as keyof Guardian];
                    setValue(f, val as string);
                });
            } else {
                reset({});
            }
        }
    }, [isOpen, guardianToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<GuardianFormInput> = (data) => {
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value === "" && key !== 'full_name' && key !== 'nik' && key !== 'phone_number') {
                    return [key, null];
                }
                return [key, value];
            })
        ) as unknown as GuardianFormInput;

        const handleError = (err: any) => {
            // Check if error is "nik already exists"
            // The structure is error.response.data.error (string)
            if (err.response?.status === 409 && err.response?.data?.error.message.includes('NIK')) {
                setError('nik', { type: 'manual', message: 'NIK sudah digunakan' });
            }
            if (err.response?.status === 409 && err.response?.data?.error.message.includes('Phone number')) {
                setError('phone_number', { type: 'manual', message: 'No. HP sudah digunakan' });
            }
        };

        if (isEditMode && guardianToEdit) {
            updateMutation.mutate({ id: guardianToEdit.id, data: payload }, { onError: handleError });
        } else {
            createMutation.mutate(payload, { onError: handleError });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Wali" : "Tambah Wali"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

                <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="NIK" {...register('nik')} error={errors.nik?.message} placeholder="16 digit NIK" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select {...register('gender')} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                            <option value="">- Pilih -</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Hubungan dg Siswa"
                    placeholder="Contoh: Paman, Kakek, Pengurus Asrama"
                    {...register('relationship_to_student')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="No. HP" {...register('phone_number', { required: 'Wajib diisi' })} error={errors.phone_number?.message} />
                    <Input label="Email" type="email" {...register('email')} />
                </div>

                <div className="bg-orange-50 p-2 rounded text-orange-800 font-semibold text-sm mt-2">Alamat Domisili</div>

                <Input label="Jalan" {...register('address')} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="RT" {...register('rt')} />
                    <Input label="RW" {...register('rw')} />
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

                <div className="pt-4 flex justify-end gap-2 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}