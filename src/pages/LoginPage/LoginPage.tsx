import { Container, Typography } from '@mui/material';

const LoginPage = () => (
        <Container className="login-page">
            <section className="login-page__content">
                <Typography
                    variant="h2"
                    component="h2"
                    color="primary"
                    className="login-page__title"
                >
                    Login
                </Typography>
            </section>
        </Container>
    );

export default LoginPage;
