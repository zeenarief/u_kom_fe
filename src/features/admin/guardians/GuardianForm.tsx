import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import type { Guardian, GuardianFormInput } from './types';

interface GuardianFormProps {
    initialData?: Guardian;
    onSubmit: (data: GuardianFormInput) => void;
    isLoading: boolean;
    isEditMode?: boolean;
}

export default function GuardianForm({ initialData, onSubmit, isLoading, isEditMode = false }: GuardianFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GuardianFormInput>();

    useEffect(() => {
        if (initialData) {
            const fields: (keyof GuardianFormInput)[] = [
                'full_name', 'nik', 'gender', 'phone_number', 'email',
                'relationship_to_student',
                'address', 'rt', 'rw', 'sub_district', 'district', 'city', 'province', 'postal_code'
            ];
            fields.forEach(f => {
                const val = initialData[f as keyof Guardian];
                setValue(f, val as string);
            });
        } else {
            reset({});
        }
    }, [initialData, setValue, reset]);

    const handleFormSubmit: SubmitHandler<GuardianFormInput> = (data) => {
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value === "" && key !== 'full_name' && key !== 'nik' && key !== 'phone_number') {
                    return [key, null];
                }
                return [key, value];
            })
        ) as unknown as GuardianFormInput;

        onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 space-y-6">

                {/* Section 1: Data Pribadi */}
                <div>
                    <div className="bg-orange-50 px-3 py-2 rounded-lg mb-4">
                        <h3 className="text-sm font-semibold text-orange-900">Data Pribadi</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                            <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />
                            <Input label="NIK" {...register('nik')} error={errors.nik?.message} placeholder="16 digit NIK" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Hubungan dengan Siswa"
                                placeholder="Contoh: Paman, Kakek, Pengurus Asrama"
                                {...register('relationship_to_student')}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select
                                    {...register('gender')}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                >
                                    <option value="">- Pilih -</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Kontak */}
                <div>
                    <div className="bg-orange-50 px-3 py-2 rounded-lg mb-4">
                        <h3 className="text-sm font-semibold text-orange-900">Kontak</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="No. HP"
                            {...register('phone_number', { required: 'Wajib diisi' })}
                            error={errors.phone_number?.message}
                        />
                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                        />
                    </div>
                </div>

                {/* Section 3: Alamat Domisili */}
                <div>
                    <div className="bg-orange-50 px-3 py-2 rounded-lg mb-4">
                        <h3 className="text-sm font-semibold text-orange-900">Alamat Domisili</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                            <div className="col-span-4">
                                <Input label="Jalan / Alamat" {...register('address')} placeholder="Jl. Mawar No. 12" />
                            </div>
                            <Input label="RT" {...register('rt')} maxLength={3} />
                            <Input label="RW" {...register('rw')} maxLength={3} />
                            <div className="col-span-2">
                                <Input label="Kelurahan" {...register('sub_district')} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Input label="Kecamatan" {...register('district')} />
                            <Input label="Kota/Kab" {...register('city')} />
                            <Input label="Provinsi" {...register('province')} />
                            <Input label="Kode Pos" {...register('postal_code')} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 pb-6 flex justify-end gap-3 border-t">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(-1)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan Data'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
