import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '../src/components/layout/Layout';
import { HomePage } from './pages/HomePage/HomePage';
import { TestEditor } from './pages/TestEditor/TestEditor';
import { TestsPage } from './pages/Tests/TestPage';
import { ExecutionHistory } from './pages/Execution/ExecutionHistory';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { ROUTES } from '../src/utils/constants';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route path={ROUTES.EDITOR} element={<TestEditor />} />
                    <Route path={`${ROUTES.EDITOR}/:testId`} element={<TestEditor />} />
                    <Route path={ROUTES.TESTS} element={<TestsPage/>} />
                    <Route path={ROUTES.HISTORY} element={<ExecutionHistory/>} />
                    <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage/>} />
                </Route>
            </Routes>
            <Toaster position='top-right' richColors closeButton/>
        </BrowserRouter>
    );
}
export default App;