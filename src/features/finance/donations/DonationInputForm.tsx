import { useState, useRef, useEffect } from 'react';
import { useCreateDonation, useUpdateDonation, useDonors } from '../donationQueries';
import { useDebounce } from '../../../hooks/useDebounce';
import { Save, Package, Plus, Trash2, UploadCloud, Wallet, Search, X, Loader2, Pencil } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Breadcrumb from '../../../components/common/Breadcrumb';
import type { DonationItem, DonationType, PaymentMethod, Donor, Donation } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DonationInputFormProps {
    initialData?: Donation;
    isEditing?: boolean;
}

const DonationInputForm = ({ initialData, isEditing = false }: DonationInputFormProps) => {
    const navigate = useNavigate();

    // Form State
    const [donorName, setDonorName] = useState('');
    const [donorPhone, setDonorPhone] = useState('');
    const [donorAddress, setDonorAddress] = useState('');
    const [type, setType] = useState<DonationType>('MONEY');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 500);
    const searchRef = useRef<HTMLDivElement>(null);

    const { data: donorsData, isLoading: isSearching } = useDonors({
        name: debouncedSearch,
        limit: 5
    });

    const createMutation = useCreateDonation();
    const updateMutation = useUpdateDonation();

    // Initialize form with initialData if editing
    useEffect(() => {
        if (isEditing && initialData) {
            setDonorName(initialData.donor.name);
            setDonorPhone(initialData.donor.phone || '');
            setDonorAddress(initialData.donor.address || '');
            setSearchTerm(initialData.donor.name);
            setType(initialData.type);
            setPaymentMethod(initialData.payment_method);
            setTotalAmount(initialData.total_amount || 0);
            setDescription(initialData.description || '');
            if (initialData.items) {
                setItems(initialData.items);
            }
        }
    }, [isEditing, initialData]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Goods State
    const [items, setItems] = useState<DonationItem[]>([]);
    const [newItem, setNewItem] = useState<DonationItem>({
        item_name: '', quantity: 1, unit: 'pcs', estimated_value: 0
    });

    const handleSelectDonor = (donor: Donor) => {
        setDonorName(donor.name);
        setDonorPhone(donor.phone || '');
        setDonorAddress(donor.address || '');
        setSearchTerm(donor.name);
        setShowSuggestions(false);
        toast.success(`Donatur terpilih: ${donor.name}`);
    };

    const handleWebSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setDonorName(e.target.value); // Sync query to name if creating new
        setShowSuggestions(true);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setDonorName('');
        setDonorPhone('');
        setDonorAddress('');
        setShowSuggestions(false);
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setTotalAmount(Number(value));
    };

    const handleAddItem = () => {
        if (!newItem.item_name || newItem.quantity <= 0) {
            toast.error('Nama barang dan jumlah harus diisi');
            return;
        }
        setItems([...items, newItem]);
        setNewItem({ item_name: '', quantity: 1, unit: 'pcs', estimated_value: 0 });
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!donorName) return toast.error('Nama donatur wajib diisi');
        if (type === 'MONEY' && totalAmount <= 0) return toast.error('Nominal donasi wajib diisi');
        if (type === 'GOODS' && items.length === 0) return toast.error('Baftar barang wajib diisi');

        try {
            if (isEditing && initialData) {
                await updateMutation.mutateAsync({
                    id: initialData.id,
                    donor_name: donorName,
                    donor_phone: donorPhone,
                    donor_address: donorAddress,
                    type,
                    payment_method: paymentMethod,
                    total_amount: type !== 'GOODS' ? totalAmount : undefined,
                    description,
                    proof_file: proofFile || undefined,
                    items_json: items.length > 0 ? JSON.stringify(items) : undefined
                });
                navigate('/dashboard/finance/donations/history');
            } else {
                await createMutation.mutateAsync({
                    donor_name: donorName,
                    donor_phone: donorPhone,
                    donor_address: donorAddress,
                    type,
                    payment_method: paymentMethod,
                    total_amount: type !== 'GOODS' ? totalAmount : undefined,
                    description,
                    proof_file: proofFile || undefined,
                    items_json: items.length > 0 ? JSON.stringify(items) : undefined
                });

                // Reset Form only if creating
                setDonorName('');
                setDonorPhone('');
                setDonorAddress('');
                setSearchTerm('');
                setTotalAmount(0);
                setDescription('');
                setProofFile(null);
                setItems([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Fundraising', href: '/dashboard', icon: Wallet },
                    { label: 'Riwayat Donasi', href: '/dashboard/finance/donations/history' },
                    { label: isEditing ? 'Edit Donasi' : 'Catat Donasi' }
                ]}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    {isEditing ? <Pencil className="text-emerald-600" /> : <Plus className="text-emerald-600" />}
                    {isEditing ? 'Edit Data Donasi' : 'Input Donasi Baru'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Data Donatur */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div className="relative" ref={searchRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Donatur <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg pl-9 p-2 text-sm border outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="Cari nama atau ketik baru..."
                                    value={searchTerm}
                                    onChange={handleWebSearch}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                                {isSearching && !searchTerm && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 animate-spin" />}
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && debouncedSearch.length >= 2 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin" /> Mencari...
                                        </div>
                                    ) : donorsData?.items && donorsData.items.length > 0 ? (
                                        <ul className="py-1">
                                            {donorsData.items.map((donor) => (
                                                <li
                                                    key={donor.id}
                                                    onClick={() => handleSelectDonor(donor)}
                                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="font-medium text-gray-900">{donor.name} - {donor.phone || "-"}</div>
                                                    <div className="text-xs text-gray-500">{donor.address || '-'}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            Tidak ditemukan. <span className="text-emerald-600 font-medium">Buat baru: "{searchTerm}"</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp / Telepon</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                placeholder="0812..."
                                value={donorPhone}
                                onChange={(e) => setDonorPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Alamat Donatur */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Donatur</label>
                        <textarea
                            className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                            placeholder="Alamat lengkap..."
                            rows={2}
                            value={donorAddress}
                            onChange={(e) => setDonorAddress(e.target.value)}
                        />
                    </div>

                    {/* 2. Detail Donasi */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Donasi</label>
                            <select
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                value={type}
                                onChange={(e) => {
                                    const newType = e.target.value as DonationType;
                                    setType(newType);
                                    if (newType === 'GOODS') setPaymentMethod('GOODS');
                                    else if (paymentMethod === 'GOODS') setPaymentMethod('CASH');
                                }}
                            >
                                <option value="MONEY">Uang (Money)</option>
                                <option value="GOODS">Barang (Goods)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                            <select
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                disabled={type === 'GOODS'}
                            >
                                <option value="CASH">Tunai (Cash)</option>
                                <option value="TRANSFER">Transfer Bank</option>
                                <option value="QRIS">QRIS</option>
                                {type === 'GOODS' && <option value="GOODS">Barang</option>}
                            </select>
                        </div>

                        {type !== 'GOODS' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none font-semibold text-gray-900"
                                    value={totalAmount > 0 ? formatRupiah(totalAmount).replace('Rp', '').trim() : ''}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {totalAmount > 0 ? formatRupiah(totalAmount) : 'Rp 0'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Item Barang (Only if GOODS) */}
                    {type === 'GOODS' && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                            <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                                <Package size={16} /> Daftar Barang Donasi
                            </h3>

                            {/* Add Item Form */}
                            <div className="grid grid-cols-12 gap-3 items-end">
                                <div className="col-span-5">
                                    <label className="text-xs text-gray-500">Nama Barang</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded p-2 text-sm"
                                        placeholder="Beras/Buku/dll"
                                        value={newItem.item_name}
                                        onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500">Jml</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded p-2 text-sm"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500">Satuan</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded p-2 text-sm"
                                        placeholder="kg/pcs"
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Button type="button" onClick={handleAddItem} className="w-full">
                                        <Plus size={14} /> Tambah
                                    </Button>
                                </div>
                            </div>

                            {/* Item List */}
                            {items.length > 0 && (
                                <div className="divide-y divide-gray-200 bg-white rounded border border-gray-200">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="p-3 flex justify-between items-center text-sm">
                                            <span>
                                                <span className="font-medium">{item.item_name}</span>
                                                <span className="text-gray-500 mx-2">
                                                    {item.quantity} {item.unit}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. Bukti Transfer & Catatan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Transfer (Opsional)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                    accept="image/*,application/pdf"
                                />
                                <div className="flex flex-col items-center gap-1 text-gray-500">
                                    <UploadCloud size={24} />
                                    <span className="text-xs">{proofFile ? proofFile.name : 'Klik untuk upload bukti'}</span>
                                    {isEditing && initialData?.proof_file && !proofFile && (
                                        <span className="text-xs text-emerald-600">Terlampir: {initialData.proof_file}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Doa (Opsional)</label>
                            <textarea
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                rows={3}
                                placeholder="Cth: Shodaqah jumat, Doa untuk keluarga..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" isLoading={isLoading}>
                            <Save className="w-4 h-4 mr-2" />
                            {isEditing ? 'Simpan Perubahan' : 'Simpan Donasi'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonationInputForm;
