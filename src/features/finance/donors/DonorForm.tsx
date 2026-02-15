import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import type { Donor } from '../types';
import { useNavigate } from 'react-router-dom';

// Type adaptation: CreateDonorRequest is likely similar to what the form outputs.
// We can define a specific interface for FormInput if strictly needed, 
// using partial of CreateDonorRequest or similar.
interface DonorFormInput {
    name: string;
    phone: string;
    email: string;
    address: string;
}

interface DonorFormProps {
    initialData?: Donor | null;
    onSubmit: (data: DonorFormInput) => void;
    isLoading: boolean;
    isEditMode?: boolean;
}

export default function DonorForm({ initialData, onSubmit, isLoading, isEditMode = false }: DonorFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<DonorFormInput>();

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('phone', initialData.phone || '');
            setValue('email', initialData.email || '');
            setValue('address', initialData.address || '');
        }
    }, [initialData, setValue]);

    const handleFormSubmit: SubmitHandler<DonorFormInput> = (data) => {
        onSubmit(data);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 rounded-t-xl">
                <h2 className="text-lg font-semibold text-emerald-800">
                    {isEditMode ? 'Edit Data Donatur' : 'Tambah Donatur Baru'}
                </h2>
                <p className="text-sm text-emerald-600 mt-1">
                    {isEditMode
                        ? 'Perbarui informasi donatur yang sudah ada.'
                        : 'Lengkapi formulir di bawah ini untuk menambahkan donatur baru.'}
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Nama Lengkap / Instansi"
                                {...register('name', { required: 'Nama wajib diisi' })}
                                error={errors.name?.message}
                                placeholder="Contoh: Budi Santoso atau PT. Berkah Jaya"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Nomor Telepon / WhatsApp"
                                {...register('phone')}
                                placeholder="Contoh: 081234567890"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Email"
                                type="email"
                                {...register('email')}
                                placeholder="Contoh: email@example.com"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                            <textarea
                                {...register('address')}
                                rows={3}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Alamat donatur..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                        Batal
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan Donatur'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
