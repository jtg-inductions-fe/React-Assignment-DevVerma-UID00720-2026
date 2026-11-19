import { AppRoutes } from '@routes';

import { Navbar } from '@containers';

export const App = () => (
    <div className="app">
        <Navbar />

        <main className="app__main">
            <AppRoutes />
        </main>
    </div>
);
