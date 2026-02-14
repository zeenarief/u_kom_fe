import { useState } from 'react';
import { Link } from 'lucide-react';
import { useUsers } from '../users/userQueries';
import Button from '../../../components/ui/Button';
import { useLinkGuardianToUser } from './guardianQueries';

interface GuardianUserLinkerProps {
    guardianId: string;
}

export default function GuardianUserLinker({ guardianId }: GuardianUserLinkerProps) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const { data: users, isLoading } = useUsers();
    const linkMutation = useLinkGuardianToUser();

    const handleLink = () => {
        if (!selectedUserId) return;
        linkMutation.mutate({ guardianId, userId: selectedUserId });
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
                        Wali ini belum memiliki akses login. Pilih akun User yang sesuai.
                    </p>

                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 py-2 px-3 border outline-none bg-white"
                            disabled={isLoading}
                        >
                            <option value="">-- Pilih Akun User --</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} (@{user.username})
                                </option>
                            ))}
                        </select>
                        <Button onClick={handleLink} isLoading={linkMutation.isPending} disabled={!selectedUserId}>
                            Simpan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}