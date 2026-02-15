import { useState } from 'react';
import CategoryManager from './CategoryManager';
import TypeManager from './TypeManager';
import Breadcrumb from '../../../../components/common/Breadcrumb';
import { ClipboardList, AlignLeft, List } from 'lucide-react';

const ViolationMasterData = () => {
    const [activeTab, setActiveTab] = useState<'category' | 'type'>('category');

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
                            <p className="text-gray-500 text-sm mt-1">Kelola aturan, kategori, dan jenis pelanggaran</p>
                        </div>

                        {/* Improved Tabs as Segmented Control */}
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => setActiveTab('category')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'category'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`}
                            >
                                <AlignLeft size={16} />
                                Kategori
                            </button>
                            <button
                                onClick={() => setActiveTab('type')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'type'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`}
                            >
                                <List size={16} />
                                Jenis Pelanggaran
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'category' ? <CategoryManager /> : <TypeManager />}
                </div>
            </div>
        </div>
    );
};

export default ViolationMasterData;
