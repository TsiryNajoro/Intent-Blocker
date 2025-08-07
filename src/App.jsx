import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Rules from './pages/Rules';
import PrivateRoute from './routes/PrivatesRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ApiProvider>
      <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<Logs />} /> 
            <Route path="logs" element={<Logs />} />
            <Route path="users" element={<Users />} />
            <Route path="rules" element={<Rules />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiProvider>
  );
}

export default App;
