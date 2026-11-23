import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAuthenticatedGitHubUser, type GitHubUser } from '@api';
import type { RootState } from '@store';

import { clearSession, getStoredSession, saveSession } from './auth.util';

interface LoginCredentials {
    username: string;
    token: string;
}

interface AuthState {
    user: GitHubUser | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const storedSession = getStoredSession();

const initialState: AuthState = {
    user: storedSession?.user ?? null,
    token: storedSession?.token ?? null,
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

export const validateSession = createAsyncThunk<
    GitHubUser,
    LoginCredentials,
    { rejectValue: string }
>(
    'auth/validateSession',
    async ({ username, token }, { rejectWithValue, signal }) => {
        try {
            const user = await getAuthenticatedGitHubUser(token, signal);

            if (user.login.toLowerCase() !== username.trim().toLowerCase()) {
                return rejectWithValue('Invalid token, please login again');
            }

            return user;
        } catch (error) {
            if (signal.aborted) throw error;
            return rejectWithValue('Session invalid.');
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            clearSession();
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
                state.token = action.meta.arg.token;
                state.error = null;
                saveSession(action.payload, action.meta.arg.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload ??
                    action.error.message ??
                    'Something went wrong during login.';
            })

            .addCase(validateSession.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(validateSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.token = action.meta.arg.token;
                state.error = null;
                saveSession(action.payload, action.meta.arg.token);
            })
            .addCase(validateSession.rejected, (state) => {
                state.status = 'idle';
                state.user = null;
                state.token = null;
                clearSession();
            });
    },
});

export const { clearAuthError, logoutUser } = authSlice.actions;

export const selectAuthUser = (state: RootState): GitHubUser | null =>
    state.auth.user;

export const selectAuthToken = (state: RootState): string | null =>
    state.auth.token;

export const selectAuthStatus = (state: RootState): AuthState['status'] =>
    state.auth.status;

export const selectAuthError = (state: RootState): string | null =>
    state.auth.error;

export default authSlice.reducer;
