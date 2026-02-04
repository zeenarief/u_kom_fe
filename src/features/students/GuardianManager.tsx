import { useState } from 'react';
import { UserCheck, Shield, AlertCircle, X, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { Student } from './types';
import { useSetGuardian, useRemoveGuardian } from './studentQueries';
import { useGuardians } from '../guardians/guardianQueries';

interface GuardianManagerProps {
    student: Student;
}

export default function GuardianManager({ student }: GuardianManagerProps) {
    const [isSelecting, setIsSelecting] = useState(false);
    const [activeTab, setActiveTab] = useState<'parents' | 'guardians'>('parents');

    const setMutation = useSetGuardian();
    const removeMutation = useRemoveGuardian();

    // Ambil data Master Guardian
    const { data: allGuardians } = useGuardians();

    // Handle Set Wali (Dinamis Type)
    const handleSelect = (id: string, type: 'parent' | 'guardian') => {
        setMutation.mutate({
            studentId: student.id,
            data: {
                guardian_id: id,
                guardian_type: type,
            }
        }, {
            onSuccess: () => setIsSelecting(false)
        });
    };

    const handleRemove = () => {
        if (confirm('Hapus status wali utama?')) {
            removeMutation.mutate(student.id);
        }
    };

    // === KONDISI 1: Sudah ada Wali ===
    if (student.guardian) {
        return (
            <div className="mt-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                    <Shield size={18} className="text-green-600" /> Wali Utama (Penanggung Jawab)
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-green-900">{student.guardian.full_name}</p>
                        <div className="flex gap-2 text-xs text-green-700 mt-1">
                            <span className="bg-green-200 px-2 py-0.5 rounded uppercase font-semibold">
                                {student.guardian.relationship || 'WALI'}
                            </span>
                            {/* Tampilkan Label Tipe Data */}
                            <span className="bg-white border border-green-200 px-2 py-0.5 rounded uppercase text-[10px] text-gray-500">
                                DATA: {student.guardian.type === 'parent' ? 'ORANG TUA' : 'WALI LAIN'}
                            </span>
                            <span className="font-mono ml-1">{student.guardian.phone_number}</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                        onClick={handleRemove}
                        isLoading={removeMutation.isPending}
                    >
                        <X size={16} /> <span className="ml-1">Hapus</span>
                    </Button>
                </div>
            </div>
        );
    }

    // === KONDISI 2: Belum ada Wali ===
    return (
        <div className="mt-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                <Shield size={18} className="text-gray-400" /> Wali Utama
            </h3>

            {!isSelecting ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <UserCheck size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">Belum ada wali utama yang ditetapkan.</p>
                    <Button onClick={() => setIsSelecting(true)}>
                        Tetapkan Wali
                    </Button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    {/* Header / Tabs */}
                    <div className="flex border-b bg-gray-50">
                        <button
                            onClick={() => setActiveTab('parents')}
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'parents' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Users size={16} /> Dari Data Keluarga
                        </button>
                        <button
                            onClick={() => setActiveTab('guardians')}
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'guardians' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Shield size={16} /> Dari Wali Lainnya
                        </button>
                        <button onClick={() => setIsSelecting(false)} className="px-3 text-gray-400 hover:text-red-500">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-4 bg-blue-50/30 min-h-[150px] max-h-[300px] overflow-y-auto">

                        {/* TAB 1: PARENTS */}
                        {activeTab === 'parents' && (
                            <>
                                <p className="text-xs text-gray-500 mb-3">Pilih salah satu dari daftar orang tua siswa ini:</p>
                                {student.parents && student.parents.length > 0 ? (
                                    <div className="space-y-2">
                                        {student.parents.map((p) => (
                                            <button
                                                key={p.parent_info.id}
                                                onClick={() => handleSelect(p.parent_info.id, 'parent')}
                                                disabled={setMutation.isPending}
                                                className="w-full text-left bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center group"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{p.parent_info.full_name}</p>
                                                    <p className="text-xs text-gray-500 uppercase">{p.relationship_type}</p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    PILIH
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Belum ada data keluarga.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* TAB 2: GUARDIANS */}
                        {activeTab === 'guardians' && (
                            <>
                                <p className="text-xs text-gray-500 mb-3">Pilih dari database wali lainnya (Paman, Kakek, dll):</p>
                                {allGuardians && allGuardians.length > 0 ? (
                                    <div className="space-y-2">
                                        {allGuardians.map((g) => (
                                            <button
                                                key={g.id}
                                                onClick={() => handleSelect(g.id, 'guardian')}
                                                disabled={setMutation.isPending}
                                                className="w-full text-left bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all flex justify-between items-center group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                                                        {g.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{g.full_name}</p>
                                                        <p className="text-xs text-gray-500">{g.relationship_to_student || 'Wali'}</p>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                    PILIH
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <Shield size={24} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Database wali kosong.</p>
                                        <p className="text-xs mt-1">Input data di menu "Data Wali" dulu.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}