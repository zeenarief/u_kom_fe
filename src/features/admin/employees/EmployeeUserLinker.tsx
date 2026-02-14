import { useState } from 'react';
import { Link } from 'lucide-react';
import { useUsers } from '../users/userQueries';
import Button from '../../../components/ui/Button';
import { useLinkEmployeeToUser } from './employeeQueries';

interface LinkerProps { employeeId: string; }

export default function EmployeeUserLinker({ employeeId }: LinkerProps) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const { data: users, isLoading } = useUsers();
    const linkMutation = useLinkEmployeeToUser();

    const handleLink = () => {
        if (!selectedUserId) return;
        linkMutation.mutate({ employeeId, userId: selectedUserId });
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-700 mt-1"><Link size={16} /></div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-yellow-800">Hubungkan ke Akun Login</h4>
                    <p className="text-xs text-yellow-700 mb-3">Pegawai ini belum bisa login. Pilih akun User.</p>
                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="flex-1 text-sm border-gray-300 rounded-md py-2 px-3 border outline-none bg-white"
                            disabled={isLoading}
                        >
                            <option value="">-- Pilih Akun User --</option>
                            {users?.map((u) => (<option key={u.id} value={u.id}>{u.name} (@{u.username})</option>))}
                        </select>
                        <Button onClick={handleLink} isLoading={linkMutation.isPending} disabled={!selectedUserId}>Simpan</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}