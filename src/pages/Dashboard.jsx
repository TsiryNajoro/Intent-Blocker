import Sidebar from '../components/Sidebar';
import { Outlet} from 'react-router-dom';

export default function Dashboard() {

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
