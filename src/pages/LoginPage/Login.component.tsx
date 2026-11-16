import { type FormEvent } from 'react';

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

interface Props {
    username: string;
    token: string;
    formErrors: { username: string; token: string };
    isLoading: boolean;
    error: string | null;
    onUsernameChange: (value: string) => void;
    onTokenChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onSnackbarClose: () => void;
}

export const LoginComponent = ({
    username,
    token,
    formErrors,
    isLoading,
    error,
    onUsernameChange,
    onTokenChange,
    onSubmit,
    onSnackbarClose,
}: Props) => (
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
                onSubmit={onSubmit}
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
                    onChange={(e) => onUsernameChange(e.target.value)}
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
                    onChange={(e) => onTokenChange(e.target.value)}
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
            onClose={onSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={onSnackbarClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {error}
            </Alert>
        </Snackbar>
    </Container>
);
