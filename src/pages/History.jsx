import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const res = await axios.get("https://be.ericsebb.qzz.io/event");
      setHistory(res.data);
    } catch (error) {
      console.error("Error cargando historial", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
    
    // Polling cada 5 segundos
    const interval = setInterval(() => {
      loadHistory();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 glow text-cyan-300">
          Historial Mensual
        </h1>

        <Card>
          {loading ? (
            <p className="text-center text-gray-500">Cargando historial...</p>
          ) : history.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              <p className="text-lg">Sin registros aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300 border-collapse">
                <thead>
                  <tr className="border-b border-cyan-400/30 bg-black/50">
                    <th className="px-4 py-3 text-cyan-300 font-semibold">ID</th>
                    <th className="px-4 py-3 text-cyan-300 font-semibold">Título</th>
                    <th className="px-4 py-3 text-cyan-300 font-semibold">Descripción</th>
                    <th className="px-4 py-3 text-cyan-300 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-pink-400/20 hover:bg-black/40 transition"
                    >
                      <td className="px-4 py-3 text-pink-300">{event.id}</td>
                      <td className="px-4 py-3 text-white font-semibold">{event.title}</td>
                      <td className="px-4 py-3 text-gray-400">{event.description}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(event.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
