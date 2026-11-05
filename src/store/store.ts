import { configureStore } from '@reduxjs/toolkit';

import githubSearchReducer from './githubSearch/githubSearchSlice';

export const store = configureStore({
    reducer: {
        githubSearch: githubSearchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
