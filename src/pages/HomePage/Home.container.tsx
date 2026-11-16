import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@store';
import {
    clearSearchError,
    clearSearchResults,
    searchGitHubUsers,
    selectSearchError,
    selectSearchResults,
    selectSearchStatus,
} from '@store/githubSearch/githubSearchSlice';

import { HomeComponent } from './Home.component';

export const HomeContainer = () => {
    const [searchParams] = useSearchParams();

    const [searchValue, setSearchValue] = useState(
        () => searchParams.get('query') ?? '',
    );
    const hasQuery = searchValue.trim().length > 0;

    const dispatch = useAppDispatch();
    const results = useAppSelector(selectSearchResults);
    const status = useAppSelector(selectSearchStatus);
    const error = useAppSelector(selectSearchError);

    const handleSnackbarClose = () => {
        dispatch(clearSearchError());
    };

    useEffect(() => {
        const query = searchValue.trim();

        dispatch(clearSearchResults());
        if (!query) return;

        let abortRequest: (() => void) | undefined;

        const timeoutId = window.setTimeout(() => {
            const request = dispatch(searchGitHubUsers({ query, perPage: 3 }));
            abortRequest = () => {
                request.abort();
            };
        }, 400);

        return () => {
            window.clearTimeout(timeoutId);
            abortRequest?.();
        };
    }, [searchValue, dispatch]);

    return (
        <HomeComponent
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            results={results}
            status={status}
            error={error}
            hasQuery={hasQuery}
            onSnackbarClose={handleSnackbarClose}
        />
    );
};
