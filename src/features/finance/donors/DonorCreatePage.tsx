import { useNavigate } from 'react-router-dom';
import DonorForm from './DonorForm';
import { useCreateDonor } from '../donationQueries';

const DonorCreatePage = () => {
    const navigate = useNavigate();
    const createMutation = useCreateDonor();

    const handleSubmit = async (data: any) => {
        await createMutation.mutateAsync(data);
        navigate('/dashboard/finance/donors');
    };

    return (
        <DonorForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
        />
    );
};

export default DonorCreatePage;
