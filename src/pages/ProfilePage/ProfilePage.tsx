import { Container, Typography } from '@mui/material';

const ProfilePage = () => (
        <Container className="profile-page">
            <section className="profile-page__content">
                <Typography
                    variant="h2"
                    component="h2"
                    className="profile-page__title"
                >
                    Profile
                </Typography>
            </section>
        </Container>
    );

export default ProfilePage;
