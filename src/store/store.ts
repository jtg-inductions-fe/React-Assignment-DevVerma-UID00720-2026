import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import githubSearchReducer from './githubSearch/githubSearch.slice';

export const store = configureStore({
    reducer: {
        githubSearch: githubSearchReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
