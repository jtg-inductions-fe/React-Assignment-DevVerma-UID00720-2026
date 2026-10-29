import { Container, Typography } from '@mui/material';

const HomePage = () => (
    <Container className="home-page">
        <section className="home-page__intro">
            <Typography
                variant="h2"
                component="h2"
                className="home-page__title"
            >
                Home page
            </Typography>
        </section>
    </Container>
);

export default HomePage;
