
import { Sidebar, Header, Footer } from '../components/Layout';
import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Header />
                <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <Outlet />
                </main>
                {/* <Footer /> */}
            </div>
        </div>
    );
}

export default MainLayout;