import { Container } from '@mui/material';

import UserProfile from '@components/UserProfile/UserProfile';
import { useAppSelector } from '@store/hooks';

const ProfilePage = () => {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
            <UserProfile user={user} />
        </Container>
    );
};

export default ProfilePage;
