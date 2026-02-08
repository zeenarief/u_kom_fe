import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Student, StudentFormInput } from './types';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentFormProps {
    initialData?: Student | null;
    onSubmit: (data: StudentFormInput) => void;
    isLoading: boolean;
    title: string;
    isEditMode?: boolean;
}

export default function StudentForm({ initialData, onSubmit, isLoading, title, isEditMode = false }: StudentFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<StudentFormInput>();

    // Efek: Isi form jika ada initialData
    useEffect(() => {
        if (initialData) {
            // 1. Kita definisikan field apa saja yang valid untuk Form ini (Whitelist)
            const fields: (keyof StudentFormInput)[] = [
                'full_name', 'no_kk', 'nik', 'nisn', 'nim', 'gender',
                'place_of_birth', 'date_of_birth', 'address', 'rt', 'rw',
                'sub_district', 'district', 'city', 'province', 'postal_code',
                'status', 'entry_year', 'graduation_year'
            ];

            fields.forEach((field) => {
                let value = initialData[field as keyof Student];

                // Logic Tanggal: Backend "2010-05-15T00:00:00Z" -> HTML Input "2010-05-15"
                if (field === 'date_of_birth' && typeof value === 'string') {
                    value = value.split('T')[0];
                }

                // Atasi Error 'any':
                setValue(field, value as string | undefined);
            });
        }
    }, [initialData, setValue]);

    const handleFormSubmit: SubmitHandler<StudentFormInput> = (data) => {
        onSubmit(data);
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

                {/* --- SECTION 1: DATA PRIBADI --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Data Pribadi & Identitas
                    </div>

                    <div className="space-y-4">
                        <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="No. KK" {...register('no_kk')} placeholder="16 digit KK" />
                            <Input label="NIK" {...register('nik')} error={errors.nik?.message} placeholder="16 digit NIK" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="NISN" {...register('nisn')} />
                            <Input label="NIM" {...register('nim')} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select {...register('gender')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                    <option value="">- Pilih -</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                            <Input label="Tempat Lahir" {...register('place_of_birth')} />
                        </div>
                        <Input label="Tanggal Lahir" type="date" {...register('date_of_birth')} />
                    </div>
                </div>

                {/* --- SECTION 2: ALAMAT --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Alamat Domisili
                    </div>

                    <div className="space-y-4">
                        <Input label="Jalan / Alamat" {...register('address')} placeholder="Jl. Mawar No. 12" />

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

                {/* --- SECTION 3: AKADEMIK & STATUS --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Akademik & Status
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Siswa</label>
                            <select {...register('status')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                <option value="ACTIVE">Aktif (ACTIVE)</option>
                                <option value="GRADUATED">Lulus (GRADUATED)</option>
                                <option value="DROPOUT">Dropout (DROPOUT)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Tahun Masuk" {...register('entry_year')} placeholder="Contoh: 2023" />
                            <Input label="Tahun Lulus" {...register('graduation_year')} placeholder="Contoh: 2026" />
                        </div>
                    </div>
                </div>

                {/* FOOTER BUTTONS */}
                <div className="pt-6 flex justify-end gap-3 border-t">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditMode ? 'Simpan Perubahan' : 'Tambah Siswa'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
