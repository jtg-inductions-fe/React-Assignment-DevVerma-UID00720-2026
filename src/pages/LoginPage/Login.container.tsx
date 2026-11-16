import {
    type FormEvent,
    type SyntheticEvent,
    useEffect,
    useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@store';
import { clearAuthError, loginUser } from '@store/auth/authSlice';

import { LoginComponent } from './Login.component';

interface LoginFormErrors {
    username: string;
    token: string;
}

export const LoginContainer = () => {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [formErrors, setFormErrors] = useState<LoginFormErrors>({
        username: '',
        token: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error, user } = useAppSelector((state) => state.auth);

    const isLoading = status === 'loading';

    const validateForm = (): boolean => {
        const errors: LoginFormErrors = { username: '', token: '' };
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

        if (!validateForm()) return;

        dispatch(clearAuthError());

        const result = await dispatch(
            loginUser({ username: username.trim(), token: token.trim() }),
        );

        if (loginUser.fulfilled.match(result)) {
            void navigate('/profile', { replace: true });
        }
    };

    const handleSnackbarClose = (
        _event?: SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') return;
        dispatch(clearAuthError());
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        setFormErrors((prev) => ({ ...prev, username: '' }));
    };

    const handleTokenChange = (value: string) => {
        setToken(value);
        setFormErrors((prev) => ({ ...prev, token: '' }));
    };

    useEffect(() => {
        if (user) {
            void navigate('/profile', { replace: true });
        }
    }, [user, navigate]);

    useEffect(
        () => () => {
            dispatch(clearAuthError());
        },
        [dispatch],
    );

    return (
        <LoginComponent
            username={username}
            token={token}
            formErrors={formErrors}
            isLoading={isLoading}
            error={error}
            onUsernameChange={handleUsernameChange}
            onTokenChange={handleTokenChange}
            onSubmit={(event) => void handleSubmit(event)}
            onSnackbarClose={handleSnackbarClose}
        />
    );
};
