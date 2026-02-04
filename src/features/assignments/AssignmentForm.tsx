import { useForm, type SubmitHandler } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useSubjects } from '../subjects/subjectQueries';
import { useEmployees } from '../employees/employeeQueries';
import { useCreateAssignment } from './assignmentQueries';
import type { AssignmentFormInput } from './types';
import Button from '../../components/ui/Button';

interface Props {
    classroomId: string;
}

export default function AssignmentForm({ classroomId }: Props) {
    const { register, handleSubmit, reset } = useForm<AssignmentFormInput>();

    // Fetch Data Master
    const { data: subjects } = useSubjects();
    const { data: employees } = useEmployees();

    const createMutation = useCreateAssignment(() => reset());

    const onSubmit: SubmitHandler<AssignmentFormInput> = (data) => {
        data.classroom_id = classroomId;
        createMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row gap-3 items-end mb-6">
            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-blue-800 mb-1">Mata Pelajaran</label>
                <select
                    {...register('subject_id', { required: true })}
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm p-2 outline-none border focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Pilih Mapel --</option>
                    {subjects?.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-blue-800 mb-1">Guru Pengampu</label>
                <select
                    {...register('teacher_id', { required: true })}
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm p-2 outline-none border focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Pilih Guru --</option>
                    {employees?.map(e => (
                        <option key={e.id} value={e.id}>{e.full_name}</option>
                    ))}
                </select>
            </div>

            <Button type="submit" isLoading={createMutation.isPending} className="w-full md:w-auto">
                <Plus size={16} className="mr-1" /> Tambahkan
            </Button>
        </form>
    );
}