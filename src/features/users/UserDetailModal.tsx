import { Edit, Mail, Shield, Key } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useUserDetail } from './userQueries';
import type { User } from './types';

interface Props {
    userId: string | null;
    onClose: () => void;
    onEdit: (user: User) => void;
}

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string; value?: string | null }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-500 mt-0.5">
            <Icon size={16} />
        </div>
        <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="block text-sm text-gray-900 mt-0.5 font-medium">{value || '-'}</span>
        </div>
    </div>
);

export default function UserDetailModal({ userId, onClose, onEdit }: Props) {
    const { data: user, isLoading, isError } = useUserDetail(userId);

    if (isLoading && userId) return <Modal isOpen={!!userId} onClose={onClose} title="Loading..."><div className="p-8 text-center">Mengambil data...</div></Modal>;
    if (isError || !user) return null;

    return (
        <Modal isOpen={!!userId} onClose={onClose} title="Detail User">
            <div className="space-y-6">

                {/* Header Profile */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl flex items-center gap-4 text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm border border-white/30">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-blue-100 text-sm">@{user.username}</p>
                    </div>
                </div>

                {/* Info Detail */}
                <div className="bg-white rounded-lg border border-gray-100 p-2">
                    <DetailRow icon={Mail} label="Email Address" value={user.email} />

                    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500 mt-0.5"><Shield size={16} /></div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Roles</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {user.roles && user.roles.length > 0 ? user.roles.map(r => (
                                    <span key={r.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium border border-blue-200">
                                        {r.name}
                                    </span>
                                )) : <span className="text-gray-400 italic text-sm">Tidak ada role</span>}
                            </div>
                        </div>
                    </div>

                    <DetailRow icon={Key} label="User ID" value={user.id} />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="ghost" onClick={onClose}>Tutup</Button>
                    <Button onClick={() => onEdit(user)}>
                        <Edit size={16} className="mr-2" /> Edit Data
                    </Button>
                </div>
            </div>
        </Modal>
    );
}