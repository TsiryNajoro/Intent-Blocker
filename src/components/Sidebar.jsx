import { getRole, clearAuth } from '../utils/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Users, Settings, LogOut, AlertCircle  } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Sidebar() {
    const role = getRole();
    const navigate = useNavigate();

    const handleLogout = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="bg-gray-900 p-6 rounded-lg max-w-sm mx-auto text-white shadow-lg">
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle size={48} className="text-red-500" />
                            <h1 className="text-xl font-bold">Confirme la déconnexion</h1>
                            <p>Veux-tu vraiment te déconnecter ?</p>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-700 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        clearAuth();
                                        onClose();
                                        navigate('/');
                                    }}
                                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                );
            },
            overlayClassName: "bg-black bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center"
        });
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`;

    return (
        <aside className="flex flex-col justify-between bg-gray-800 text-white w-64 min-h-screen p-6">
            <nav>
                <ul className="flex flex-col space-y-6">
                    <li>
                        <NavLink to="/dashboard/logs" className={linkClasses}>
                            <FileText size={20} />
                            Logs
                        </NavLink>
                    </li>
                    {role === 'admin' && (
                        <>
                            <li>
                                <NavLink to="/dashboard/users" className={linkClasses}>
                                    <Users size={20} />
                                    Utilisateurs
                                </NavLink>
                            </li>
                            {/* <li>
                                <NavLink to="/dashboard/rules" className={linkClasses}>
                                    <Settings size={20} />
                                    Règles
                                </NavLink>
                            </li> */}
                        </>
                    )}
                </ul>
            </nav>

            <button
                onClick={handleLogout}
                className="mt-8 w-full py-3 bg-red-600 rounded hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
            >
                <LogOut size={20} />
                Se déconnecter
            </button>
        </aside>
    );
}
