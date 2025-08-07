import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { saveAuth } from '../utils/auth';
import { apiFetch } from '../utils/apiFetch';
import { User, Lock } from 'lucide-react';
import { useEffect } from 'react';
import { clearAuth } from '../utils/auth';
import { toast } from 'react-toastify';
import { ShieldCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    clearAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const devMode = true; // Passe à false quand le backend est prêt

    if (devMode) {
      //  Mode test :  simule un login sans backend
      const fakeData = {
        token: 'faketoken123',
        role: username === 'admin' ? 'admin' : 'user',
        username,
      };

      saveAuth(fakeData.token, fakeData.role);
      toast.success(`Bienvenue ${fakeData.username} !`);
      navigate('/dashboard');
    } else {
      // Mode réel : appel au backend
      try {
        const data = await apiFetch(api.login, {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });

        // Supposé : { token: '...', role: '...', username: '...' }
        saveAuth(data.token, data.role);
        toast.success(`Bienvenue ${username} !`);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
        toast.error(`Connexion échouée !`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
          <ShieldCheck size={28} className="mr-1" />
          Intent-Blocker
        </h2>        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition text-lg font-semibold"
          >
            S'Authentifier
          </button>
        </form>
        {/* {error && (
          <p className="mt-6 text-red-600 text-center font-medium text-lg">{error}</p>
        )} */}
      </div>
    </div>
  );



}
