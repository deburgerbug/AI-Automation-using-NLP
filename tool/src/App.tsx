import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '../src/components/layout/Layout';
import { HomePage } from './pages/HomePage/HomePage';
import { ROUTES } from '../src/utils/constants';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                </Route>
            </Routes>
            <Toaster position='top-right' richColors closeButton/>
        </BrowserRouter>
    );
}
export default App;