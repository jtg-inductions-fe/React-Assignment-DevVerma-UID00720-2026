import {
    type FormEvent,
    type SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { LoginComponent } from '@components';
import { ROUTES } from '@constants';
import {
    selectAuthError,
    selectAuthStatus,
    selectAuthUser,
    useAppDispatch,
    useAppSelector,
} from '@store';
import { clearAuthError, loginUser } from '@store';

const PAT_REGEX =
    /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})$/;

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

    const abortRef = useRef<(() => void) | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const status = useAppSelector(selectAuthStatus);
    const error = useAppSelector(selectAuthError);
    const user = useAppSelector(selectAuthUser);

    const isLoading = status === 'loading';

    const validateForm = (): boolean => {
        const errors: LoginFormErrors = { username: '', token: '' };
        const trimmedUsername = username.trim();
        const trimmedToken = token.trim();

        if (!trimmedUsername) {
            errors.username = 'Username is required.';
        } else if (trimmedUsername.length < 3) {
            errors.username = 'Username must be at least 3 characters.';
        }

        if (!trimmedToken) {
            errors.token = 'Personal access token is required.';
        } else if (!PAT_REGEX.test(trimmedToken)) {
            errors.token =
                'Invalid PAT. Expected classic or fine-grained token.';
        }

        setFormErrors(errors);
        return !errors.username && !errors.token;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

        abortRef.current?.();

        dispatch(clearAuthError());

        const request = dispatch(
            loginUser({ username: username.trim(), token: token.trim() }),
        );

        abortRef.current = () => {
            request.abort();
        };
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
            void navigate(ROUTES.PROFILE, { replace: true });
        }
    }, [user, navigate]);

    useEffect(
        () => () => {
            abortRef.current?.();
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
            onSubmit={(event) => handleSubmit(event)}
            onSnackbarClose={handleSnackbarClose}
        />
    );
};
