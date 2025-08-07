import { getToken, clearAuth } from './auth';

export const apiFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      clearAuth(); // au cas où le token a expiré
      throw new Error('Non autorisé. Veuillez vous reconnecter.');
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Erreur inconnue');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export default apiFetch;
