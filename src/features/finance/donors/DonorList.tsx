import { useState } from 'react';
import { useDonors, useUpdateDonor } from '../donationQueries';
import { Search, Users, MapPin, Phone, Mail, Pencil } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import type { Donor } from '../types';

import { useNavigate } from 'react-router-dom';

const DonorList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const { data: donorsData, isLoading } = useDonors({ name: searchTerm });
    const updateMutation = useUpdateDonor();

    // Edit State
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form State
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editAddress, setEditAddress] = useState('');

    const handleEdit = (donor: Donor) => {
        setSelectedDonor(donor);
        setEditName(donor.name);
        setEditPhone(donor.phone || '');
        setEditEmail(donor.email || '');
        setEditAddress(donor.address || '');
        setIsEditModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDonor) return;

        try {
            await updateMutation.mutateAsync({
                id: selectedDonor.id,
                name: editName,
                phone: editPhone,
                email: editEmail,
                address: editAddress
            });
            setIsEditModalOpen(false);
            setSelectedDonor(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Fundraising', href: '/dashboard', icon: Users },
                    { label: 'Data Donatur' }
                ]}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Donatur</h1>
                    <p className="text-gray-500 text-sm">Database donatur terdaftar</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari nama donatur..."
                    className="flex-1 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Nama Donatur</th>
                            <th className="px-6 py-3">Kontak</th>
                            <th className="px-6 py-3">Alamat</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8">Loading...</td>
                            </tr>
                        ) : donorsData?.items?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-400">
                                    Donatur tidak ditemukan
                                </td>
                            </tr>
                        ) : (
                            donorsData?.items?.map((donor: Donor) => (
                                <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div
                                            className="cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => navigate(`/dashboard/finance/donors/${donor.id}`)}
                                        >
                                            {donor.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {donor.phone && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Phone size={12} className="text-gray-400" />
                                                    {donor.phone}
                                                </div>
                                            )}
                                            {donor.email && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Mail size={12} className="text-gray-400" />
                                                    {donor.email}
                                                </div>
                                            )}
                                            {!donor.phone && !donor.email && '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            {donor.address || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(donor)}
                                            className="text-gray-400 hover:text-emerald-600 transition-colors"
                                            title="Edit Donatur"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Data Donatur"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Donatur</label>
                        <input
                            type="text"
                            className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none focus:ring-2 focus:ring-emerald-500"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WA</label>
                        <input
                            type="text"
                            className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none focus:ring-2 focus:ring-emerald-500"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                        <input
                            type="email"
                            className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none focus:ring-2 focus:ring-emerald-500"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <textarea
                            className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={updateMutation.isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            isLoading={updateMutation.isPending}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DonorList;
