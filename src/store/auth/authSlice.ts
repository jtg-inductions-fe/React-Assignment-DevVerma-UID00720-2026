import { getAuthenticatedGitHubUser, type GitHubUser } from '@api/githubApi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const USER_INFO_STORAGE_KEY = 'githubUser';
export const USER_TOKEN_STORAGE_KEY = 'githubToken';

interface LoginCredentials {
    username: string;
    token: string;
}

interface AuthState {
    user: GitHubUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const getStoredUser = (): GitHubUser | null => {
    try {
        const storedUser = localStorage.getItem(USER_INFO_STORAGE_KEY);
        const storedToken = localStorage.getItem(USER_TOKEN_STORAGE_KEY);

        if (!storedUser || !storedToken) {
            return null;
        }

        const parsedUser: unknown = JSON.parse(storedUser);

        if (
            typeof parsedUser !== 'object' ||
            parsedUser === null ||
            !('id' in parsedUser) ||
            typeof parsedUser.id !== 'number' ||
            !('login' in parsedUser) ||
            typeof parsedUser.login !== 'string' ||
            !('avatar_url' in parsedUser) ||
            typeof parsedUser.avatar_url !== 'string' ||
            !('html_url' in parsedUser) ||
            typeof parsedUser.html_url !== 'string' ||
            !('type' in parsedUser) ||
            typeof parsedUser.type !== 'string'
        ) {
            return null;
        }

        return parsedUser as GitHubUser;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    user: getStoredUser(),
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk<
    GitHubUser,
    LoginCredentials,
    { rejectValue: string }
>('auth/login', async ({ username, token }, { rejectWithValue, signal }) => {
    try {
        const user = await getAuthenticatedGitHubUser(token, signal);

        if (user.login.toLowerCase() !== username.trim().toLowerCase()) {
            return rejectWithValue(
                'The entered username does not match the GitHub account associated with this token.',
            );
        }

        localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(user));

        localStorage.setItem(USER_TOKEN_STORAGE_KEY, token);

        return user;
    } catch (error) {
        if (signal.aborted) {
            throw error;
        }

        return rejectWithValue(
            error instanceof Error
                ? error.message
                : 'Something went wrong during login.',
        );
    }
});

export const logoutUser = createAsyncThunk('auth/logout', () => {
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload ??
                    action.error.message ??
                    'Something went wrong during login.';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
                state.error = null;
            });
    },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
