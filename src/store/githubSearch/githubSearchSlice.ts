import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    type GitHubSearchResponse,
    searchGitHubUsers as searchGitHubUsersApi,
} from '../../api/githubApi';

interface GitHubSearchState {
    results: GitHubSearchResponse | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentRequestId?: string;
}

const initialState: GitHubSearchState = {
    results: null,
    status: 'idle',
    error: null,
    currentRequestId: undefined,
};

export const searchGitHubUsers = createAsyncThunk<
    GitHubSearchResponse,
    string,
    { rejectValue: string }
>('githubSearch/searchUsers', async (query, { rejectWithValue, signal }) => {
    try {
        return await searchGitHubUsersApi(query, 3, signal);
    } catch (error) {
        if (signal.aborted) {
            throw error;
        }

        return rejectWithValue(
            error instanceof Error
                ? error.message
                : 'Something went wrong while searching GitHub.',
        );
    }
});

const githubSearchSlice = createSlice({
    name: 'githubSearch',
    initialState,
    reducers: {
        clearSearchResults(state) {
            state.results = null;
            state.status = 'idle';
            state.error = null;
            state.currentRequestId = undefined;
        },
        clearSearchError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchGitHubUsers.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
                state.results = null;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(searchGitHubUsers.fulfilled, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) {
                    return;
                }

                state.status = 'succeeded';
                state.results = action.payload;
                state.currentRequestId = undefined;
            })
            .addCase(searchGitHubUsers.rejected, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) {
                    return;
                }

                state.currentRequestId = undefined;

                if (action.meta.aborted) {
                    state.status = 'idle';
                    return;
                }

                state.status = 'failed';
                state.error =
                    action.payload ??
                    action.error.message ??
                    'Something went wrong while searching GitHub.';
            });
    },
});

export const { clearSearchResults, clearSearchError } =
    githubSearchSlice.actions;

export default githubSearchSlice.reducer;
