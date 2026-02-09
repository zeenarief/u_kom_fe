import { useState } from 'react';
import { useUsers } from '../../features/users/userQueries';
import Button from '../ui/Button';
import { Link } from 'lucide-react';

interface UserLinkerProps {
    entityId: string;
    entityType: 'student' | 'parent' | 'guardian' | 'employee';
    onLink: (entityId: string, userId: string) => void;
    isLoading?: boolean;
}

export default function UserLinker({ entityId, entityType, onLink, isLoading: linkLoading }: UserLinkerProps) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const { data: users, isLoading } = useUsers();

    const handleLink = () => {
        if (!selectedUserId) return;
        onLink(entityId, selectedUserId);
    };

    const entityLabels = {
        student: 'Siswa',
        parent: 'Orang Tua',
        guardian: 'Wali',
        employee: 'Pegawai'
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-700 mt-1">
                    <Link size={16} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-yellow-800">Hubungkan ke Akun Login</h4>
                    <p className="text-xs text-yellow-700 mb-3">
                        {entityLabels[entityType]} ini belum bisa login. Pilih akun User yang sudah dibuat untuk dihubungkan.
                    </p>

                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                            disabled={isLoading}
                        >
                            <option value="">-- Pilih Akun User --</option>
                            {users?.map((user: { id: string; name: string; username: string }) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} (@{user.username})
                                </option>
                            ))}
                        </select>
                        <Button
                            onClick={handleLink}
                            isLoading={linkLoading}
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
