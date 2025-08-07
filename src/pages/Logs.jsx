import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import apiFetch from '../utils/apiFetch';
import { toast } from 'react-toastify';

export default function Logs() {
  const api = useApi();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      let url = api.allLogs;
      if (filter === 'allowed') url = api.allowedIPs;
      else if (filter === 'blocked') url = api.blockedIPs;

      try {
        const data = await apiFetch(url);
        setLogs(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchLogs();
  }, [filter, api]);

  const { updateIpStatus } = useApi();

  const handleUpdateStatus = async (ip, status) => {
    try {
      await apiFetch(updateIpStatus(ip), {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success(`${status === 'blocked' ? 'IP bloquée' : 'IP débloquée'} avec succès : ${ip}`);
      console.log(`${status === 'blocked' ? 'Bloqué' : 'Autorisé'} ${ip}`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut IP:', err);
      toast.error("Erreur, Veuillez réessaier plus tard !");
    }
  };



  return (
    <div className="relative p-6">
      <h2 className="text-2xl font-semibold mb-4">Logs du serveur SSH</h2>

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        {['all', 'blocked', 'allowed'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded transition ${filter === type ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            onClick={() => setFilter(type)}
          >
            {type === 'all' ? 'Tous' : type === 'blocked' ? 'Bloqués' : 'Autorisés'}
          </button>
        ))}
      </div>

      {/* Liste des logs */}
      <ul className="space-y-4">
        {logs.length === 0 && <p className="text-gray-500">Aucun log trouvé.</p>}

        {logs.map((log) => (
          <li
            key={log.id}
            onClick={() => setSelectedLog(log)}
            className={`flex justify-between items-center p-4 shadow rounded border cursor-pointer transition
            ${log.status === 'allowed'
                ? 'bg-green-50 border-green-200 hover:bg-green-100'
                : log.status === 'blocked'
                  ? 'bg-red-50 border-red-200 hover:bg-red-100'
                  : 'bg-white hover:bg-blue-50'
              } hover:shadow-md`}
          >
            <div>
              <p className="font-medium text-gray-800">IP : {log.ip_address}</p>
              <p className="text-sm text-gray-500">
                {log.event_type} — {log.timestamp}
              </p>
            </div>

            {filter === 'allowed' && (
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(log.ip_address, 'blocked');
                }}
              >
                Bloquer
              </button>

            )}

            {filter === 'blocked' && (
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleUpdateStatus(log.ip_address, 'allowed'); 
                }}
              >
                Autoriser
              </button>

            )}
          </li>
        ))}
      </ul>

      {/* Boîte de détails */}
      {selectedLog && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-6 rounded shadow-lg z-50 border">
          <h3 className="text-xl font-semibold mb-4 text-center">Détails du log</h3>
          <div className="space-y-2 text-sm text-gray-800">
            <p><strong>IP :</strong> {selectedLog.ip_address}</p>
            <p><strong>Username :</strong> {selectedLog.username}</p>
            <p><strong>Event :</strong> {selectedLog.event_type}</p>
            <p><strong>Port :</strong> {selectedLog.port}</p>
            <p><strong>Timestamp :</strong> {selectedLog.timestamp}</p>
            <p><strong>Message :</strong> {selectedLog.raw_message}</p>
          </div>
          <button
            onClick={() => setSelectedLog(null)}
            className="mt-6 block mx-auto bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );

}
