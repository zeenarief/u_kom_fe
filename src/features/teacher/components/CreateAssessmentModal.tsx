import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateAssessment, type CreateAssessmentRequest } from '../teacherQueries';
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import toast from 'react-hot-toast';

interface CreateAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    teachingAssignmentId: string;
}

const CreateAssessmentModal = ({ isOpen, onClose, teachingAssignmentId }: CreateAssessmentModalProps) => {
    const queryClient = useQueryClient();
    const createMutation = useCreateAssessment();

    const [formData, setFormData] = useState<Omit<CreateAssessmentRequest, 'teaching_assignment_id'>>({
        title: '',
        type: 'ASSIGNMENT',
        max_score: 100,
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'max_score' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            ...formData,
            teaching_assignment_id: teachingAssignmentId,
        }, {
            onSuccess: () => {
                toast.success('Penilaian berhasil dibuat');
                queryClient.invalidateQueries({ queryKey: ['assessments', teachingAssignmentId] });
                onClose();
                // Reset form
                setFormData({
                    title: '',
                    type: 'ASSIGNMENT',
                    max_score: 100,
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Gagal membuat penilaian');
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Buat Penilaian Baru">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Contoh: Ulangan Harian 1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipe</label>
                    <select
                        name="type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="ASSIGNMENT">Tugas (Assignment)</option>
                        <option value="QUIZ">Kuis (Quiz)</option>
                        <option value="MID_EXAM">UTS (Mid Exam)</option>
                        <option value="FINAL_EXAM">UAS (Final Exam)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nilai Maksimal</label>
                        <input
                            type="number"
                            name="max_score"
                            required
                            min="1"
                            max="1000"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={formData.max_score}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
                    <textarea
                        name="description"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" isLoading={createMutation.isPending}>
                        Simpan
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateAssessmentModal;
