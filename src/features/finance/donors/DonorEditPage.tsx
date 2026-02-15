import { useNavigate, useParams, Navigate } from 'react-router-dom';
import DonorForm from './DonorForm';
import { useDonor, useUpdateDonor } from '../donationQueries';
import { Loader2 } from 'lucide-react';

const DonorEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: donor, isLoading, isError } = useDonor(id || '');
    const updateMutation = useUpdateDonor();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (isError || !donor) {
        return <Navigate to="/dashboard/finance/donors" replace />;
    }

    const handleSubmit = async (data: any) => {
        if (!id) return;
        await updateMutation.mutateAsync({ id, ...data });
        navigate('/dashboard/finance/donors');
    };

    return (
        <DonorForm
            initialData={donor}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEditMode={true}
        />
    );
};

export default DonorEditPage;
