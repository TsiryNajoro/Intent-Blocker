import { useState, useEffect, useRef } from 'react';
import { useApi } from '../context/ApiContext';
import apiFetch from '../utils/apiFetch';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Users() {
  const api = useApi();
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const formRef = useRef(null);
  const [addingUser, setAddingUser] = useState(false);
  const addFormRef = useRef(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  //Sortie pour formulaire d'ajout  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addFormRef.current && !addFormRef.current.contains(event.target)) {
        setAddingUser(false);
      }
    };

    if (addingUser) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addingUser]);

  //Sortie pour formulaire de modif
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setEditUserId(null);
      }
    };

    if (editUserId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editUserId]);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch(api.getUsers);
      setUsers(data);
    } catch (err) {
      console.error('Erreur de récupération des utilisateurs', err);
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditingUser(user);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const role = e.target.role.value;
    const password = e.target.password.value;

    // Validation simple du mot de passe
    if (
      password.length <= 6 ||
      !/[a-zA-Z]/.test(password) ||  // au moins une lettre
      !/\d/.test(password)          // au moins un chiffre
    ) {
      toast.error(
        "Le mot de passe doit contenir plus de 6 caractères, au moins une lettre et un chiffre."
      );
      return; // stoppe le submit si invalide
    }

    try {
      await apiFetch(api.createUser, {
        method: 'POST',
        body: JSON.stringify({ username, role, password }),  // ajoute password dans le body
      });
      setAddingUser(false); // Ferme le form
      fetchUsers();         // Refresh la liste
      toast.success("Utilisateur ajouté avec succès !");
    } catch (err) {
      console.error('Erreur lors de la création', err);
      toast.error("Erreur lors de la création de l'utilisateur.");
    }
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(api.updateUser(editUserId), {
        method: 'PUT',
        body: JSON.stringify({ username: editUsername, role: editRole }),
      });
      setEditUserId(null);
      fetchUsers();
      toast.success(`Utilisateur modifié avec succès !`);
    } catch (err) {
      console.error('Erreur de modification', err);
      toast.error("Erreur lors de la modification de l'utilisateur.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(api.deleteUser(id), { method: 'DELETE' });
      setConfirmDeleteId(null);
      fetchUsers();
      toast.success(`Utilisateur supprimé avec succès !`);
    } catch (err) {
      console.error('Erreur de suppression', err);
      toast.error("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Liste des utilisateurs</h2>
        <button
          onClick={() => setAddingUser(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <span>Nouvel utilisateur</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            {editUserId === user.id ? (
              <form
                ref={formRef}
                onSubmit={handleEditSubmit}
                className="flex flex-col sm:flex-row gap-4 w-full items-center"
              >

                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="px-3 py-2 border rounded w-full sm:w-1/3"
                  required
                />
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="px-3 py-2 border rounded w-full sm:w-1/3"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Enregistrer
                </button>
              </form>
            ) : (
              <>
                <div>
                  <p className="font-medium text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(user.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {addingUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div
            ref={addFormRef}
            className="bg-white p-6 rounded shadow z-50 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouvel utilisateur</h3>
            <form onSubmit={handleCreate}>
              <input
                name="username"
                placeholder="Nom d'utilisateur"
                className="block w-full mb-4 border px-4 py-2 rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="block w-full mb-4 border px-4 py-2 rounded"
                required
                minLength={7}
              />
              <select
                name="role"
                defaultValue="user"
                className="block w-full mb-4 border px-4 py-2 rounded"
                required
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddingUser(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <p className="mb-4 text-gray-800 font-semibold">Supprimer cet utilisateur ?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Oui
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
