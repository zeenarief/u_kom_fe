import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Parent, ParentFormInput } from './types';
import { useCreateParent, useUpdateParent } from './parentQueries';

interface ParentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    parentToEdit?: Parent | null;
}

export default function ParentFormModal({ isOpen, onClose, parentToEdit }: ParentFormModalProps) {
    const isEditMode = !!parentToEdit;
    const createMutation = useCreateParent(onClose);
    const updateMutation = useUpdateParent(onClose);

    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm<ParentFormInput>();

    // Efek: Isi form jika mode Edit (Whitelist Approach)
    useEffect(() => {
        if (isOpen) {
            if (parentToEdit) {
                const fields: (keyof ParentFormInput)[] = [
                    'full_name', 'nik', 'gender', 'place_of_birth', 'date_of_birth',
                    'life_status', 'marital_status', 'phone_number', 'email',
                    'education_level', 'occupation', 'income_range',
                    'address', 'rt', 'rw', 'sub_district', 'district', 'city', 'province', 'postal_code'
                ];

                fields.forEach((field) => {
                    let value = parentToEdit[field as keyof Parent];
                    // Format Tanggal
                    if (field === 'date_of_birth' && typeof value === 'string') {
                        value = value.split('T')[0];
                    }
                    setValue(field, value as string | undefined);
                });
            } else {
                reset({});
            }
        }
    }, [isOpen, parentToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<ParentFormInput> = (data) => {
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value === "" && key !== 'full_name' && key !== 'nik') {
                    return [key, null];
                }
                return [key, value];
            })
        ) as unknown as ParentFormInput;

        const handleError = (err: any) => {
            // Check if error is "nik already exists"
            // The structure is error.response.data.error (string)
            if (err.response?.status === 409) {
                setError('nik', { type: 'manual', message: 'NIK sudah digunakan' });
            }
        };

        // Format Tanggal: Kirim YYYY-MM-DD apa adanya
        // if (payload.date_of_birth) {
        //     payload.date_of_birth = `${payload.date_of_birth}T00:00:00Z`;
        // }

        if (isEditMode && parentToEdit) {
            updateMutation.mutate({ id: parentToEdit.id, data: payload }, { onError: handleError });
        } else {
            createMutation.mutate(payload, { onError: handleError });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Data Orang Tua" : "Tambah Orang Tua"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

                {/* --- SECTION 1: IDENTITAS PRIBADI --- */}
                <div className="bg-purple-50 p-2 rounded text-purple-800 font-semibold text-sm">
                    Identitas Pribadi
                </div>

                <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />
                <Input label="NIK" {...register('nik')} error={errors.nik?.message} placeholder="16 digit NIK" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select {...register('gender')} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                            <option value="">- Pilih -</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Hidup</label>
                        <select {...register('life_status')} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                            <option value="alive">Hidup</option>
                            <option value="deceased">Meninggal</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Tempat Lahir" {...register('place_of_birth')} />
                    <Input label="Tanggal Lahir" type="date" {...register('date_of_birth')} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Pernikahan</label>
                    <select {...register('marital_status')} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                        <option value="">- Pilih -</option>
                        <option value="married">Menikah</option>
                        <option value="divorced">Cerai Hidup</option>
                        <option value="widowed">Cerai Mati</option>
                    </select>
                </div>

                {/* --- SECTION 2: KONTAK & PEKERJAAN --- */}
                <div className="bg-purple-50 p-2 rounded text-purple-800 font-semibold text-sm mt-4">
                    Kontak & Ekonomi
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="No. HP" {...register('phone_number')} />
                    <Input label="Email" type="email" {...register('email')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
                        <select {...register('education_level')} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                            <option value="">- Pilih -</option>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA/SMK</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                            <option value="Tidak Sekolah">Tidak Sekolah</option>
                        </select>
                    </div>
                    <Input label="Pekerjaan" {...register('occupation')} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kisaran Penghasilan</label>
                    <select {...register('income_range')} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                        <option value="">- Pilih -</option>
                        <option value="< 1 Juta">Kurang dari 1 Juta</option>
                        <option value="1-3 Juta">1 - 3 Juta</option>
                        <option value="3-5 Juta">3 - 5 Juta</option>
                        <option value="5-10 Juta">5 - 10 Juta</option>
                        <option value="> 10 Juta">Lebih dari 10 Juta</option>
                    </select>
                </div>


                {/* --- SECTION 3: ALAMAT --- */}
                <div className="bg-purple-50 p-2 rounded text-purple-800 font-semibold text-sm mt-4">
                    Alamat Domisili
                </div>

                <Input label="Jalan" {...register('address')} placeholder="Nama jalan, gang, nomor..." />

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


                <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}