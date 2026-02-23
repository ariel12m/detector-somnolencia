import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EventsToday() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadEventsToday() {
    try {
      // Obtener todos los eventos del backend
      const res = await axios.get("http://localhost:3000/event");
      
      // Filtrar solo los eventos de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEvents = res.data.filter(event => {
        const eventDate = new Date(event.createdAt);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
      });

      setEvents(todayEvents);
    } catch (error) {
      console.error("Error cargando eventos de hoy", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventsToday();
  }, []);

  // Contar eventos por tipo
  const headDownCount = events.filter(e => e.title?.toLowerCase().includes("head") || e.description?.toLowerCase().includes("head")).length;
  
  // Calcular tiempo total de cabeza agachada
  const headDownEvents = events.filter(e => e.title?.toLowerCase().includes("head") || e.description?.toLowerCase().includes("head"));
  const headDownDuration = headDownEvents.reduce((total, event) => {
    // Si hay información de duración en los datos, usarla; si no, asumir 5 segundos por evento
    const duration = event.duration || 5;
    return total + duration;
  }, 0);
  
  const minutes = Math.floor(headDownDuration / 60);
  const seconds = headDownDuration % 60;

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 glow text-cyan-300">
          Eventos de Hoy
        </h1>

        {!loading && (
          <div className="flex justify-center mb-8">
            <Card className="max-w-sm">
              <h3 className="text-xl font-semibold mb-2 text-[#39ff14]">
                Total de Eventos
              </h3>
              <p className="text-3xl font-bold">{events.length}</p>
            </Card>
          </div>
        )}

        <Card>
          {loading ? (
            <p className="text-center text-gray-500">Cargando eventos...</p>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              <p className="text-lg">No hay eventos registrados hoy.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((e, i) => (
                <li
                  key={i}
                  className="bg-black/30 border border-cyan-400/30 rounded-lg p-3 flex justify-between items-center hover:glow transition"
                >
                  <div className="flex-1">
                    <span className="text-cyan-200 font-semibold block">
                      {e.title}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {e.description}
                    </span>
                  </div>

                  <span className="text-gray-400 text-sm ml-4">
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
