import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { HomeComponent } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import {
    clearSearchError,
    clearSearchResults,
    searchGitHubUsers,
    selectSearchError,
    selectSearchResults,
    selectSearchStatus,
} from '@store';

export const HomeContainer = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchValue, setSearchValue] = useState(
        () => searchParams.get('user') ?? '',
    );
    const hasQuery = searchValue.trim().length > 0;

    const dispatch = useAppDispatch();
    const results = useAppSelector(selectSearchResults);
    const status = useAppSelector(selectSearchStatus);
    const error = useAppSelector(selectSearchError);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setSearchParams(value.trim() ? { user: value.trim() } : {}, {
            replace: true,
        });
    };

    const handleSnackbarClose = () => {
        dispatch(clearSearchError());
    };

    useEffect(() => {
        const query = searchValue.trim();

        if (!query) {
            dispatch(clearSearchResults());
            return;
        }

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
            onSearchChange={handleSearchChange}
            results={results}
            status={status}
            error={error}
            hasQuery={hasQuery}
            onSnackbarClose={handleSnackbarClose}
        />
    );
};
