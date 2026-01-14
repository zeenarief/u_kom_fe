import { useState } from 'react';
import { useUsers } from '../users/userQueries'; // Reuse query user yang sudah ada
import Button from '../../components/ui/Button';
import { useLinkStudentToUser } from './studentQueries';
import { Link } from 'lucide-react';

interface UserLinkerProps {
    studentId: string;
}

export default function UserLinker({ studentId }: UserLinkerProps) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const { data: users, isLoading } = useUsers();
    const linkMutation = useLinkStudentToUser();

    const handleLink = () => {
        if (!selectedUserId) return;
        linkMutation.mutate({ studentId, userId: selectedUserId });
    };

    // Filter User: Idealnya backend menyediakan endpoint /users/available
    // Tapi untuk sekarang kita tampilkan semua user dulu di dropdown
    // Nanti Anda bisa filter user yang sudah punya role 'student' atau filter di backend

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-700 mt-1">
                    <Link size={16} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-yellow-800">Hubungkan ke Akun Login</h4>
                    <p className="text-xs text-yellow-700 mb-3">
                        Siswa ini belum bisa login. Pilih akun User yang sudah dibuat untuk dihubungkan.
                    </p>

                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                            disabled={isLoading}
                        >
                            <option value="">-- Pilih Akun User --</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} (@{user.username})
                                </option>
                            ))}
                        </select>
                        <Button
                            onClick={handleLink}
                            isLoading={linkMutation.isPending}
                            disabled={!selectedUserId}
                            className="whitespace-nowrap"
                        >
                            Simpan
                        </Button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                        *Pastikan Anda sudah membuat akun di menu "Manajemen User" terlebih dahulu.
                    </p>
                </div>
            </div>
        </div>
    );
}