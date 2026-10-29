import { Container, Typography } from '@mui/material';

const Navbar = () => (
        <Container className="home-page">
            <section className="home-page__intro">
                <Typography
                    variant="h3"
                    component="h3"
                    className="home-page__title"
                >
                    NavBar
                </Typography>
            </section>
        </Container>
    );

export default Navbar;
