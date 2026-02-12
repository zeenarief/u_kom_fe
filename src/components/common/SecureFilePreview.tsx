import { useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface SecureFilePreviewProps {
    url?: string | null;
    label?: string;
    buttonText?: string;
    className?: string;
}

export default function SecureFilePreview({ url, buttonText = "Lihat Dokumen", className = "" }: SecureFilePreviewProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePreview = async () => {
        if (!url) return;

        setIsLoading(true);
        try {
            // Fetch as Blob using configured axios instance (includes Auth header)
            const response = await api.get(url, { responseType: 'blob' });

            // Create a Blob URL
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(file);

            // Open in new tab
            window.open(fileURL, '_blank');

            // Note: We rely on browser GC or page unload to revoke, 
            // or we could use a timeout if we wanted to be strict, 
            // but for a "new tab" open, we need it to persist for a moment.
        } catch (error) {
            console.error('Failed to load file', error);
            toast.error('Gagal membuka dokumen. Pastikan Anda memiliki akses.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!url) return null;

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={handlePreview}
            disabled={isLoading}
            className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-auto font-normal ${className}`}
        >
            {isLoading ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
                <Eye size={14} className="mr-1.5" />
            )}
            {buttonText}
        </Button>
    );
}
