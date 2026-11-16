import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '@store';

import {
    type GitHubSearchResponse,
    searchGitHubUsers as searchGitHubUsersApi,
} from '@api/githubApi';

interface GitHubSearchState {
    results: GitHubSearchResponse | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface SearchOptions {
    query: string;
    perPage?: number;
}

const initialState: GitHubSearchState = {
    results: null,
    status: 'idle',
    error: null,
};

const selectGitHubSearch = (state: RootState) => state.githubSearch;

export const searchGitHubUsers = createAsyncThunk<
    GitHubSearchResponse,
    SearchOptions,
    { rejectValue: string }
>(
    'githubSearch/searchUsers',
    async ({ query, perPage = 3 }, { rejectWithValue, signal }) => {
        try {
            return await searchGitHubUsersApi(query, perPage, signal);
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
    },
);

const githubSearchSlice = createSlice({
    name: 'githubSearch',
    initialState,
    reducers: {
        clearSearchResults(state) {
            state.results = null;
            state.status = 'idle';
            state.error = null;
        },
        clearSearchError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchGitHubUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.results = null;
            })
            .addCase(searchGitHubUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload;
            })
            .addCase(searchGitHubUsers.rejected, (state, action) => {
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

export const selectSearchResults = createSelector(
    [selectGitHubSearch],
    (slice) => slice.results,
);

export const selectSearchStatus = createSelector(
    [selectGitHubSearch],
    (slice) => slice.status,
);

export const selectSearchError = createSelector(
    [selectGitHubSearch],
    (slice) => slice.error,
);

export default githubSearchSlice.reducer;
