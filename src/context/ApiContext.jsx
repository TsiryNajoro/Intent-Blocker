import { createContext, useContext } from 'react';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;     // http://127.0.0.1:5000/api
  const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL;   // http://127.0.0.1:5000/auth

  const endpoints = {
    //  Auth
    login: `${AUTH_BASE}/login`,
    createUser: `${AUTH_BASE}/create`,
    getUsers: `${AUTH_BASE}/users`,                     // GET all users
    getUser: (id) => `${AUTH_BASE}/users/${id}`,        // GET one user
    updateUser: (id) => `${AUTH_BASE}/users/${id}`,     // PUT
    deleteUser: (id) => `${AUTH_BASE}/users/${id}`,     // DELETE

    //  Logs
    allLogs: `${API_BASE}/logs/db`,
    blockedIPs: `${API_BASE}/blocked_ips`,
    allowedIPs: `${API_BASE}/allowed_ips`,

    // Mise à jour du statut IP (bloquer / autoriser)
    updateIpStatus: (ip) => `${API_BASE}/status/${ip}`,
  };

  return (
    <ApiContext.Provider value={endpoints}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
