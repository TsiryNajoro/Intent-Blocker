// Enregistre le token et le rôle
export const saveAuth = (token, role) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('role', role);
};

// Récupère le token JWT
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Récupère le rôle de l'utilisateur
export const getRole = () => {
  return localStorage.getItem('role');
};

// Supprime les infos d'auth (utile pour logout)
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('role');
};

// Vérifie si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!getToken(); 
};
