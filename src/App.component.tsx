import { Navbar } from '@components';
import { AppRoutes } from '@routes';

export const App = () => (
    <div className="app">
        <Navbar />

        <main className="app__main">
            <AppRoutes />
        </main>
    </div>
);
