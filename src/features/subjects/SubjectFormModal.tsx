import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Subject, SubjectFormInput } from './types';
import { useCreateSubject, useUpdateSubject } from './subjectQueries';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    dataToEdit?: Subject | null;
}

export default function SubjectFormModal({ isOpen, onClose, dataToEdit }: Props) {
    const isEdit = !!dataToEdit;

    const createMutation = useCreateSubject(onClose);
    const updateMutation = useUpdateSubject(onClose);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SubjectFormInput>();

    useEffect(() => {
        if (isOpen) {
            if (dataToEdit) {
                setValue('code', dataToEdit.code);
                setValue('name', dataToEdit.name);
                setValue('type', dataToEdit.type);
                setValue('description', dataToEdit.description);
            } else {
                reset({});
            }
        }
    }, [isOpen, dataToEdit, setValue, reset]);

    const onSubmit: SubmitHandler<SubjectFormInput> = (data) => {
        // Paksa kode jadi Uppercase
        data.code = data.code.toUpperCase();

        if (isEdit && dataToEdit) {
            updateMutation.mutate({ id: dataToEdit.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-2">
                    Kode Mapel harus unik (Contoh: MTK-W, IND-10).
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* Kode Mapel lebih pendek */}
                    <div className="col-span-1">
                        <Input
                            label="Kode"
                            placeholder="MTK"
                            {...register('code', { required: 'Wajib diisi' })}
                            error={errors.code?.message}
                            // Auto uppercase saat mengetik
                            onInput={(e) => (e.currentTarget.value = e.currentTarget.value.toUpperCase())}
                        />
                    </div>
                    {/* Nama Mapel lebih panjang */}
                    <div className="col-span-2">
                        <Input
                            label="Nama Mata Pelajaran"
                            placeholder="Matematika Wajib"
                            {...register('name', { required: 'Wajib diisi' })}
                            error={errors.name?.message}
                        />
                    </div>
                </div>

                {/* Jenis Mapel (Bisa diganti Select kalau mau strict, sementara Input dulu agar fleksibel) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok / Jenis</label>
                    <input
                        list="subject-types"
                        {...register('type')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                        placeholder="Pilih atau ketik sendiri..."
                    />
                    <datalist id="subject-types">
                        <option value="Muatan Nasional" />
                        <option value="Muatan Kewilayahan" />
                        <option value="C1. Dasar Bidang Keahlian" />
                        <option value="C2. Dasar Program Keahlian" />
                        <option value="C3. Kompetensi Keahlian" />
                        <option value="Muatan Lokal" />
                    </datalist>
                </div>

                <Input label="Deskripsi (Opsional)" {...register('description')} />

                <div className="pt-4 flex justify-end gap-2 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isLoading}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}