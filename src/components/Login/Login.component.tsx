import { type FormEvent } from 'react';

import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { AlertSnackbar } from '@components';

interface LoginProps {
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

export const LoginComponent = (props: LoginProps) => {
    const {
        username,
        token,
        formErrors,
        isLoading,
        error,
        onUsernameChange,
        onTokenChange,
        onSubmit,
        onSnackbarClose,
    } = props;

    return (
        <Box maxWidth="sm" sx={{ mx: 'auto', p: 5 }}>
            <Stack direction="column" alignItems="center" spacing={3}>
                <Stack direction="column" alignItems="center" spacing={1}>
                    <Typography variant="h2" component="h1" color="primary">
                        Login
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sign in using your GitHub credentials.
                    </Typography>
                </Stack>

                <Stack
                    component="form"
                    onSubmit={onSubmit}
                    noValidate
                    direction="column"
                    spacing={2.5}
                    sx={{ width: '100%', mt: 2 }}
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
                </Stack>
            </Stack>

            <AlertSnackbar
                open={Boolean(error)}
                message={error}
                onClose={onSnackbarClose}
            />
        </Box>
    );
};
