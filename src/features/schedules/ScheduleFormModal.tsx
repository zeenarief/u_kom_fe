import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { ScheduleFormInput } from '../../types/api';
import { useCreateSchedule } from './scheduleQueries';
import { useAssignmentsByClass } from '../assignments/assignmentQueries'; // Reuse query assignments

interface Props {
    isOpen: boolean;
    onClose: () => void;
    classroomId: string;
}

export default function ScheduleFormModal({ isOpen, onClose, classroomId }: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ScheduleFormInput>();

    // 1. Ambil daftar Mapel+Guru yang tersedia di kelas ini
    const { data: assignments } = useAssignmentsByClass(classroomId);

    const createMutation = useCreateSchedule(classroomId, () => {
        reset();
        onClose();
    });

    const onSubmit: SubmitHandler<ScheduleFormInput> = (data) => {
        createMutation.mutate(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Jadwal Pelajaran">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* PILIH MAPEL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran & Guru</label>
                    <select
                        {...register('teaching_assignment_id', { required: 'Wajib dipilih' })}
                        className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Mapel --</option>
                        {assignments?.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.subject_name} ({a.teacher_name})
                            </option>
                        ))}
                    </select>
                    {errors.teaching_assignment_id && <p className="text-red-500 text-xs mt-1">{errors.teaching_assignment_id.message}</p>}

                    {assignments?.length === 0 && (
                        <p className="text-xs text-orange-500 mt-1">
                            *Belum ada guru pengampu di kelas ini. Atur di menu Guru Pengampu dulu.
                        </p>
                    )}
                </div>

                {/* HARI */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                    <select
                        {...register('day_of_week', { required: 'Wajib dipilih' })}
                        className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1">Senin</option>
                        <option value="2">Selasa</option>
                        <option value="3">Rabu</option>
                        <option value="4">Kamis</option>
                        <option value="5">Jumat</option>
                        <option value="6">Sabtu</option>
                        {/* <option value="7">Minggu</option> */}
                    </select>
                </div>

                {/* JAM */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="time"
                        label="Jam Mulai"
                        {...register('start_time', { required: 'Wajib diisi' })}
                    />
                    <Input
                        type="time"
                        label="Jam Selesai"
                        {...register('end_time', { required: 'Wajib diisi' })}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={createMutation.isPending}>Simpan</Button>
                </div>
            </form>
        </Modal>
    );
}