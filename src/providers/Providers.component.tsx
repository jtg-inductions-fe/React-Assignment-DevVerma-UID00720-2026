import { CssBaseline, ThemeProvider } from '@mui/material';

import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';

import { store } from '@store';
import { theme } from '@theme';

interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
    </Provider>
);
