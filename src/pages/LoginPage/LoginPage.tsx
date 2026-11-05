import { type FormEvent, type SyntheticEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';

import { clearAuthError, loginUser } from '@store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

interface LoginFormErrors {
    username: string;
    token: string;
}

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    const [formErrors, setFormErrors] = useState<LoginFormErrors>({
        username: '',
        token: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { status, error } = useAppSelector((state) => state.auth);

    const isLoading = status === 'loading';

    const validateForm = (): boolean => {
        const errors: LoginFormErrors = {
            username: '',
            token: '',
        };

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            errors.username = 'Username is required.';
        } else if (trimmedUsername.length < 3) {
            errors.username = 'Username must be at least 3 characters.';
        }

        if (!token.trim()) {
            errors.token = 'Personal access token is required.';
        }

        setFormErrors(errors);

        return !errors.username && !errors.token;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch(clearAuthError());

        const result = await dispatch(
            loginUser({
                username: username.trim(),
                token: token.trim(),
            }),
        );

        if (loginUser.fulfilled.match(result)) {
            void navigate('/profile', { replace: true });
        }
    };

    const handleSnackbarClose = (
        _event?: SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(clearAuthError());
    };

    return (
        <Container maxWidth="sm" sx={{ py: { xs: 5, sm: 8 } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" color="primary">
                        Login
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Sign in using your GitHub credentials.
                    </Typography>
                </Box>

                <Box
                    component="form"
                    onSubmit={(event) => void handleSubmit(event)}
                    noValidate
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                        mt: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="GitHub Username"
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                            setFormErrors((previous) => ({
                                ...previous,
                                username: '',
                            }));
                        }}
                        error={Boolean(formErrors.username)}
                        helperText={formErrors.username}
                        disabled={isLoading}
                        autoComplete="username"
                    />

                    <TextField
                        fullWidth
                        label="Personal Access Token"
                        type="password"
                        value={token}
                        onChange={(event) => {
                            setToken(event.target.value);
                            setFormErrors((previous) => ({
                                ...previous,
                                token: '',
                            }));
                        }}
                        error={Boolean(formErrors.token)}
                        helperText={formErrors.token}
                        disabled={isLoading}
                        autoComplete="off"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                            py: 1.25,
                            mt: 1,
                            textTransform: 'none',
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default LoginPage;
