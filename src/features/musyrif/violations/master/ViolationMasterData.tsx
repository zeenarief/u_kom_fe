import TypeManager from './TypeManager';
import Breadcrumb from '../../../../components/common/Breadcrumb';
import { ClipboardList } from 'lucide-react';

const ViolationMasterData = () => {
    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Tata Tertib', icon: ClipboardList }
                ]}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Tata Tertib & Kategori</h2>
                            <p className="text-gray-500 text-sm mt-1">Kelola kategori dan jenis pelanggaran secara terpadu</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <TypeManager />
                </div>
            </div>
        </div>
    );
};

export default ViolationMasterData;
