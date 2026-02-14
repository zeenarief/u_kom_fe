import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import type { Employee, EmployeeFormInput } from './types';

interface EmployeeFormProps {
    initialData?: Employee;
    onSubmit: (data: EmployeeFormInput) => void;
    isLoading: boolean;
    isEditMode?: boolean;
}

export default function EmployeeForm({ initialData, onSubmit, isLoading, isEditMode = false }: EmployeeFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmployeeFormInput>();

    useEffect(() => {
        if (initialData) {
            const fields: (keyof EmployeeFormInput)[] = [
                'full_name', 'nip', 'nik', 'job_title', 'gender',
                'date_of_birth', 'join_date', 'employment_status',
                'phone_number', 'address'
            ];
            fields.forEach(field => {
                let value = initialData[field as keyof Employee];
                // Format dates
                if ((field === 'date_of_birth' || field === 'join_date') && typeof value === 'string') {
                    value = value.split('T')[0];
                }
                setValue(field, value as string);
            });
        } else {
            reset({});
        }
    }, [initialData, setValue, reset]);

    const handleFormSubmit: SubmitHandler<EmployeeFormInput> = (data) => {
        // Convert empty strings to null (except required fields)
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value === "" && key !== 'full_name' && key !== 'job_title') {
                    return [key, null];
                }
                return [key, value];
            })
        ) as unknown as EmployeeFormInput;

        onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 space-y-6">

                {/* Section 1: Data Pribadi */}
                <div>
                    <div className="bg-teal-50 px-3 py-2 rounded-lg mb-4">
                        <h3 className="text-sm font-semibold text-teal-900">Data Pribadi</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nama Lengkap"
                                {...register('full_name', { required: 'Wajib diisi' })}
                                error={errors.full_name?.message}
                            />
                            <Input
                                label="NIK"
                                {...register('nik')}
                                placeholder="16 digit NIK"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select
                                    {...register('gender')}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                >
                                    <option value="">- Pilih -</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                            <Input
                                label="Tanggal Lahir"
                                type="date"
                                {...register('date_of_birth')}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Data Pekerjaan */}
                <div>
                    <div className="bg-teal-50 px-3 py-2 rounded-lg mb-4">
                        <h3 className="text-sm font-semibold text-teal-900">Data Pekerjaan</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="NIP"
                                {...register('nip')}
                                placeholder="Nomor Induk Pegawai"
                            />
                            <Input
                                label="Jabatan"
                                {...register('job_title', { required: 'Wajib diisi' })}
                                error={errors.job_title?.message}
                                placeholder="Contoh: Guru Matematika, Kepala Sekolah"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Kepegawaian</label>
                                <select
                                    {...register('employment_status')}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                >
                                    <option value="">- Pilih -</option>
                                    <option value="PNS">PNS</option>
                                    <option value="Honorer">Honorer</option>
                                    <option value="Tetap">Tetap</option>
                                    <option value="Kontrak">Kontrak</option>
                                    <option value="Magang">Magang</option>
                                </select>
                            </div>
                            <Input
                                label="Tanggal Bergabung"
                                type="date"
                                {...register('join_date')}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Kontak & Alamat */}
                <div>
                    <div className="bg-teal-50 px-3 py-2 rounded-lg mb-4">
                        <h3 className="text-sm font-semibold text-teal-900">Kontak & Alamat</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="No. HP"
                                {...register('phone_number')}
                                placeholder="08xxxxxxxxxx"
                            />
                            <div className="col-span-2">
                                <Input
                                    label="Alamat Lengkap"
                                    {...register('address')}
                                    placeholder="Jl. Contoh No. 123"
                                />
                            </div>
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
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan Data'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
