import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Student, StudentFormInput } from './types';
import { useNavigate } from 'react-router-dom';
import SecureFilePreview from '../../components/common/SecureFilePreview';

interface StudentFormProps {
    initialData?: Student | null;
    onSubmit: (data: StudentFormInput) => void;
    isLoading: boolean;
    isEditMode?: boolean;
}

export default function StudentForm({ initialData, onSubmit, isLoading, isEditMode = false }: StudentFormProps) {
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
                'status', 'entry_year', 'exit_year'
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
        // Convert empty strings to null (except required fields)
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                // Keep required fields as-is, convert empty optional fields to null
                if (value === "" && key !== 'full_name' && key !== 'nik') {
                    return [key, null];
                }
                return [key, value];
            })
        ) as unknown as StudentFormInput;

        onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">

            <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 space-y-6">

                {/* --- SECTION 1: DATA PRIBADI --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Data Pribadi & Identitas
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Nama Lengkap" {...register('full_name', { required: 'Wajib diisi' })} error={errors.full_name?.message} />
                            <Input label="NIK" {...register('nik')} error={errors.nik?.message} placeholder="16 digit NIK" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Input label="NISN" {...register('nisn')} />
                            <Input label="NIM" {...register('nim')} />
                            <div className="col-span-2">
                                <Input label="No. KK" {...register('no_kk')} placeholder="16 digit KK" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select {...register('gender')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                    <option value="">- Pilih -</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                            <Input label="Tempat Lahir" {...register('place_of_birth')} />
                            <Input label="Tanggal Lahir" type="date" {...register('date_of_birth')} />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: ALAMAT --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Alamat Domisili
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

                {/* --- SECTION 3: AKADEMIK & STATUS --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Akademik & Status
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Siswa</label>
                                <select {...register('status')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                    <option value="INACTIVE">Tidak Aktif (INACTIVE)</option>
                                    <option value="ACTIVE">Aktif (ACTIVE)</option>
                                    <option value="GRADUATED">Lulus (GRADUATED)</option>
                                    <option value="DROPOUT">Dropout (DROPOUT)</option>
                                </select>
                            </div>
                            <Input label="Tahun Masuk" {...register('entry_year')} placeholder="Contoh: 2023" />
                            <Input label="Tahun Keluar" {...register('exit_year')} placeholder="Contoh: 2026" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 4: DOKUMEN PENDUKUNG --- */}
                <div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold text-sm mb-4">
                        Dokumen Pendukung
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Akta Kelahiran */}
                            <div>
                                <Input
                                    label="Akta Kelahiran (PDF/Image)"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('birth_certificate_file')}
                                />
                                {isEditMode && initialData?.birth_certificate_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.birth_certificate_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Kartu Keluarga */}
                            <div>
                                <Input
                                    label="Kartu Keluarga (PDF/Image)"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('family_card_file')}
                                />
                                {isEditMode && initialData?.family_card_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.family_card_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Surat Pernyataan Orang Tua */}
                            <div>
                                <Input
                                    label="Surat Pernyataan Orang Tua"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('parent_statement_file')}
                                />
                                {isEditMode && initialData?.parent_statement_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.parent_statement_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Surat Pernyataan Siswa */}
                            <div>
                                <Input
                                    label="Surat Pernyataan Siswa"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('student_statement_file')}
                                />
                                {isEditMode && initialData?.student_statement_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.student_statement_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Kartu Asuransi Kesehatan */}
                            <div>
                                <Input
                                    label="Kartu Asuransi Kesehatan"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('health_insurance_file')}
                                />
                                {isEditMode && initialData?.health_insurance_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.health_insurance_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Ijazah Terakhir */}
                            <div>
                                <Input
                                    label="Ijazah Terakhir"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('diploma_certificate_file')}
                                />
                                {isEditMode && initialData?.diploma_certificate_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.diploma_certificate_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Surat Keterangan Lulus */}
                            <div>
                                <Input
                                    label="Surat Keterangan Lulus"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('graduation_certificate_file')}
                                />
                                {isEditMode && initialData?.graduation_certificate_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.graduation_certificate_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>

                            {/* Surat Keterangan Tidak Mampu */}
                            <div>
                                <Input
                                    label="Surat Keterangan Tidak Mampu"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register('financial_hardship_letter_file')}
                                />
                                {isEditMode && initialData?.financial_hardship_letter_file_url && (
                                    <div className="mt-1 text-xs">
                                        File saat ini: <SecureFilePreview url={initialData.financial_hardship_letter_file_url} buttonText="Lihat Document" />
                                    </div>
                                )}
                            </div>
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
