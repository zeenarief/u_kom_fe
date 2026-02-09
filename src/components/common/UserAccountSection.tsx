import { ShieldCheck, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import UserLinker from './UserLinker';
import { formatDate } from '../../lib/date';

interface User {
    id: string;
    username: string;
    email: string;
    last_login?: string;
}

interface UserAccountSectionProps {
    user?: User | null;
    entityId: string;
    entityType: 'student' | 'parent' | 'guardian';
    themeColor: 'blue' | 'purple' | 'orange';
    onLink: (entityId: string, userId: string) => void;
    onUnlink: () => void;
    linkLoading?: boolean;
    unlinkLoading?: boolean;
}

const themeConfig = {
    blue: {
        iconColor: 'text-blue-600',
        gradientBg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        avatarBg: 'bg-green-100',
        avatarText: 'text-green-700',
        titleText: 'text-green-900',
        usernameText: 'text-green-800',
        usernameBg: 'bg-green-100',
        emailText: 'text-green-700',
        lastLoginText: 'text-green-600',
        checkIcon: 'text-green-600',
    },
    purple: {
        iconColor: 'text-purple-600',
        gradientBg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        avatarBg: 'bg-green-100',
        avatarText: 'text-green-700',
        titleText: 'text-green-900',
        usernameText: 'text-green-800',
        usernameBg: 'bg-green-100',
        emailText: 'text-green-700',
        lastLoginText: 'text-green-600',
        checkIcon: 'text-green-600',
    },
    orange: {
        iconColor: 'text-orange-600',
        gradientBg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        avatarBg: 'bg-green-100',
        avatarText: 'text-green-700',
        titleText: 'text-green-900',
        usernameText: 'text-green-800',
        usernameBg: 'bg-green-100',
        emailText: 'text-green-700',
        lastLoginText: 'text-green-600',
        checkIcon: 'text-green-600',
    },
};

export default function UserAccountSection({
    user,
    entityId,
    entityType,
    themeColor,
    onLink,
    onUnlink,
    linkLoading,
    unlinkLoading,
}: UserAccountSectionProps) {
    const theme = themeConfig[themeColor];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className={theme.iconColor} />
                    <h3 className="font-semibold text-gray-900">Akun Sistem</h3>
                </div>
            </div>
            <div className="p-6">
                {user ? (
                    <div className="max-w-2xl">
                        <div className={`bg-gradient-to-r ${theme.gradientBg} border ${theme.border} rounded-xl p-5`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-14 h-14 ${theme.avatarBg} rounded-full flex items-center justify-center ${theme.avatarText} font-bold text-2xl border-4 border-white shadow-sm`}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${theme.titleText} flex items-center gap-2`}>
                                            Akun Terhubung
                                            <CheckCircle size={16} className={theme.checkIcon} />
                                        </p>
                                        <p className={`text-sm ${theme.usernameText} mt-1 font-medium`}>
                                            Username: <span className={`font-mono ${theme.usernameBg} px-2 py-0.5 rounded`}>{user.username}</span>
                                        </p>
                                        <p className={`text-sm ${theme.emailText} mt-1`}>
                                            Email: {user.email}
                                        </p>
                                        <p className={`text-xs ${theme.lastLoginText} mt-2`}>
                                            Terakhir login: {user.last_login ? formatDate(user.last_login) : 'Belum pernah login'}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={onUnlink}
                                    isLoading={unlinkLoading}
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 w-full sm:w-auto"
                                >
                                    Putuskan Akun
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Note:</span> Memutuskan akun akan menghapus akses login. Data pribadi akan tetap tersimpan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-full text-amber-700">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Belum Terhubung</p>
                                    <p className="text-xs text-amber-700 mt-0.5">
                                        Hubungkan ke akun user agar bisa login ke sistem.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <UserLinker
                            entityId={entityId}
                            entityType={entityType}
                            onLink={onLink}
                            isLoading={linkLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
