import Navbar from '@components/Navbar/Navbar';
import AppRoutes from '@routes/AppRoutes';

const App = () => (
        <div className="app">
            <Navbar />

            <main className="app__main">
                <AppRoutes />
            </main>
        </div>
    );

export default App;
