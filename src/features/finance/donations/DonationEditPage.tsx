import { useParams, Navigate } from 'react-router-dom';
import DonationInputForm from './DonationInputForm';
import { useDonation } from '../donationQueries';
import { Loader2 } from 'lucide-react';

const DonationEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: donation, isLoading, isError } = useDonation(id || '');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (isError || !donation) {
        return <Navigate to="/dashboard/finance/donations/history" replace />;
    }

    return <DonationInputForm initialData={donation} isEditing={true} />;
};

export default DonationEditPage;
