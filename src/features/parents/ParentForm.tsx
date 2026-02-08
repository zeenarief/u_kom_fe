import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Parent, ParentFormInput } from './types';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ParentFormProps {
    initialData?: Parent | null;
    onSubmit: (data: ParentFormInput) => void;
    isLoading: boolean;
    title: string;
    isEditMode?: boolean;
}

export default function ParentForm({ initialData, onSubmit, isLoading, title, isEditMode = false }: ParentFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ParentFormInput>();

    // Efek: Isi form jika ada initialData
    useEffect(() => {
        if (initialData) {
            const fields: (keyof ParentFormInput)[] = [
                'full_name', 'nik', 'gender', 'place_of_birth', 'date_of_birth',
                'life_status', 'marital_status', 'phone_number', 'email',
                'education_level', 'occupation', 'income_range',
                'address', 'rt', 'rw', 'sub_district', 'district', 'city', 'province', 'postal_code'
            ];

            fields.forEach((field) => {
                let value = initialData[field as keyof Parent];
                // Format Tanggal
                if (field === 'date_of_birth' && typeof value === 'string') {
                    value = value.split('T')[0];
                }
                setValue(field, value as string | undefined);
            });
        }
    }, [initialData, setValue]);

    const handleFormSubmit: SubmitHandler<ParentFormInput> = (data) => {
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value === "" && key !== 'full_name' && key !== 'nik') {
                    return [key, null];
                }
                return [key, value];
            })
        ) as unknown as ParentFormInput;

        onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">

                {/* --- SECTION 1: IDENTITAS PRIBADI --- */}
                <div>
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-800 font-semibold text-sm mb-4">
                        Identitas Pribadi
                    </div>

                    <div className="space-y-4">
                        <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />
                        <Input label="NIK" {...register('nik')} error={errors.nik?.message} placeholder="16 digit NIK" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select {...register('gender')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                                    <option value="">- Pilih -</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Hidup</label>
                                <select {...register('life_status')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                                    <option value="alive">Hidup</option>
                                    <option value="deceased">Meninggal</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Tempat Lahir" {...register('place_of_birth')} />
                            <Input label="Tanggal Lahir" type="date" {...register('date_of_birth')} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Pernikahan</label>
                            <select {...register('marital_status')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                                <option value="">- Pilih -</option>
                                <option value="married">Menikah</option>
                                <option value="divorced">Cerai Hidup</option>
                                <option value="widowed">Cerai Mati</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: KONTAK & PEKERJAAN --- */}
                <div>
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-800 font-semibold text-sm mb-4">
                        Kontak & Ekonomi
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="No. HP" {...register('phone_number')} />
                            <Input label="Email" type="email" {...register('email')} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
                                <select {...register('education_level')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
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
                            <select {...register('income_range')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                                <option value="">- Pilih -</option>
                                <option value="< 1 Juta">Kurang dari 1 Juta</option>
                                <option value="1-3 Juta">1 - 3 Juta</option>
                                <option value="3-5 Juta">3 - 5 Juta</option>
                                <option value="5-10 Juta">5 - 10 Juta</option>
                                <option value="> 10 Juta">Lebih dari 10 Juta</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: ALAMAT --- */}
                <div>
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-800 font-semibold text-sm mb-4">
                        Alamat Domisili
                    </div>

                    <div className="space-y-4">
                        <Input label="Jalan / Alamat" {...register('address')} placeholder="Nama jalan, gang, nomor..." />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="RT" {...register('rt')} maxLength={3} />
                            <Input label="RW" {...register('rw')} maxLength={3} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Kelurahan" {...register('sub_district')} />
                            <Input label="Kecamatan" {...register('district')} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Kota/Kab" {...register('city')} />
                            <Input label="Provinsi" {...register('province')} />
                        </div>
                        <Input label="Kode Pos" {...register('postal_code')} />
                    </div>
                </div>

                {/* FOOTER BUTTONS */}
                <div className="pt-6 flex justify-end gap-3 border-t">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditMode ? 'Simpan Perubahan' : 'Tambah Orang Tua'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
