import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { api } from "../api/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sleepData, setSleepData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();

  async function loadData() {
    try {
      // Obtener todos los eventos
      const res = await axios.get("https://be.ericsebb.qzz.io/event");
      setEvents(res.data);

      // Cargar datos del usuario
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("Id"));
      if (token) {
        const userRes = await api.get(`user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
      }

      // Calcular datos de sueño
      calculateSleepData(res.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateSleepData(allEvents) {
    // Filtrar eventos de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = allEvents.filter(event => {
      const eventDate = new Date(event.createdAt);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });

    // Contar eventos de somnolencia
    const sleepyCount = todayEvents.length;
    const totalHours = 8; // Asumir 8 horas de conducción
    const sleepyPercentage = (sleepyCount / 100) * 100; // % de eventos
    const awakePercentage = 100 - sleepyPercentage;

    setSleepData({
      sleepy: sleepyCount,
      awake: totalHours * 60 - sleepyCount, // minutos
      sleepyPercentage: Math.min(sleepyPercentage, 100),
      awakePercentage: Math.max(awakePercentage, 0),
    });
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function openEdit() {
    setEditForm({
      name: user.name || "",
      cedula: user.cedula || "",
      phone: user.phone || "",
      address: user.address || "",
      licenseNumber: user.licenseNumber || "",
      vehicle: user.vehicle || "",
    });
    setIsEditing(true);
  }

  function closeEdit() {
    setIsEditing(false);
    setEditForm({});
  }

  function handleEditChange(field, value) {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("Id"));
      
      await api.patch(`user/${userId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar el usuario local
      setUser(prev => ({
        ...prev,
        ...editForm
      }));

      setIsEditing(false);
      alert("Perfil actualizado exitosamente!");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil. Por favor intenta de nuevo.");
    } finally {
      setSavingProfile(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar eventos de hoy
  const todayEvents = events.filter(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.createdAt);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  // Crear historial simplificado (últimos 7 registros)
  const simplifiedHistory = events.slice(-7).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a001a] via-[#1a0033] to-[#0a001a]">
      {/* SIDEBAR/NAVBAR INTEGRADA */}
      <div className="w-full py-4 px-6 flex justify-between items-center bg-[#0a001a]/70 backdrop-blur-md border-b border-cyan-400/30 shadow-md sticky top-0 z-50">
        <h1 className="text-3xl font-bold text-cyan-300 drop-shadow-lg">
          Somnolencia
        </h1>

        <button
          onClick={logout}
          className="bg-red-600/80 px-4 py-2 rounded-md hover:bg-red-700 transition text-white font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* TABS DE NAVEGACIÓN */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-cyan-400 text-black glow"
                : "bg-[#0f1629]/70 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === "events"
                ? "bg-cyan-400 text-black glow"
                : "bg-[#0f1629]/70 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400"
            }`}
          >
            Eventos Hoy
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === "history"
                ? "bg-cyan-400 text-black glow"
                : "bg-[#0f1629]/70 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400"
            }`}
          >
            Historial
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-cyan-400 text-black glow"
                : "bg-[#0f1629]/70 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400"
            }`}
          >
            Perfil
          </button>
        </div>

        {/* CONTENIDO DE TABS */}
        <div className="animate-fadeIn">
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-4xl font-bold text-[#00eaff] text-center mb-4 drop-shadow-xl">
                Dashboard
              </h2>

              <p className="text-center text-gray-400 mb-10 text-lg">
                Bienvenido al sistema de detección de somnolencia. 🚗💤
                <br />
                Mantente atento, conductor
              </p>

              {loading ? (
                <p className="text-center text-gray-500">Cargando datos...</p>
              ) : sleepData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {/* GRÁFICO DE SUEÑO */}
                  <Card className="max-w-lg">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
                      Estado de Sueño Hoy
                    </h3>

                    {/* Gráfico circular simple */}
                    <div className="flex justify-center mb-8">
                      <div className="relative w-40 h-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Círculo de fondo */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="rgba(255,255,255,0.05)"
                            stroke="rgba(0,234,255,0.3)"
                            strokeWidth="2"
                          />

                          {/* Segmento de Despierto */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#39ff14"
                            strokeWidth="8"
                            strokeDasharray={`${(sleepData.awakePercentage / 100) * 251.2} 251.2`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                          />

                          {/* Segmento de Somnolencia */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ff006e"
                            strokeWidth="8"
                            strokeDasharray={`${(sleepData.sleepyPercentage / 100) * 251.2} 251.2`}
                            strokeDashoffset={`-${(sleepData.awakePercentage / 100) * 251.2}`}
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                          />

                          {/* Centro del círculo */}
                          <circle cx="50" cy="50" r="28" fill="#0a001a" />
                        </svg>

                        {/* Texto en el centro */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-cyan-300">
                            {sleepData.sleepyPercentage.toFixed(0)}%
                          </span>
                          <span className="text-xs text-gray-400">Somnolencia</span>
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 border border-green-400/30 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400 mb-1">Despierto</p>
                        <p className="text-2xl font-bold text-green-400">
                          {sleepData.awakePercentage.toFixed(0)}%
                        </p>
                      </div>

                      <div className="bg-black/30 border border-pink-400/30 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400 mb-1">Somnolencia</p>
                        <p className="text-2xl font-bold text-pink-400">
                          {sleepData.sleepyPercentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/30 border border-cyan-400/30 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400 mb-1">Eventos Detectados</p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {sleepData.sleepy}
                        </p>
                      </div>

                      <div className="bg-black/30 border border-cyan-400/30 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400 mb-1">Minutos Despierto</p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {sleepData.awake}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* RESUMEN RÁPIDO */}
                  <Card className="max-w-lg">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
                      Resumen del Día
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 border border-cyan-400/50 rounded-lg p-4">
                        <p className="text-gray-300 mb-1">Reporte de hoy</p>
                        <p className="text-3xl font-bold text-cyan-300">
                          {todayEvents.length}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          eventos de somnolencia detectados
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 border border-green-400/50 rounded-lg p-4">
                        <p className="text-gray-300 mb-1">Estado Actual</p>
                        <p className="text-3xl font-bold text-green-400">
                          {sleepData.awakePercentage > 80 ? "✓ Alerta" : "⚠ Precaución"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {sleepData.awakePercentage > 80
                            ? "Mantén la concentración"
                            : "Considera descansar"}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-pink-500/20 to-pink-500/5 border border-pink-400/50 rounded-lg p-4">
                        <p className="text-gray-300 mb-1">Consejo</p>
                        <p className="text-sm text-pink-300">
                          {sleepData.sleepyPercentage > 20
                            ? "⚠ Tu nivel de somnolencia es alto. Toma un descanso de 15-20 minutos."
                            : "✓ Excelente desempeño. Sigue asi!"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB: EVENTOS HOY */}
          {activeTab === "events" && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-8 glow text-cyan-300">
                Eventos de Hoy
              </h1>

              <Card>
                {loading ? (
                  <p className="text-center text-gray-500">Cargando eventos...</p>
                ) : todayEvents.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-lg">No hay eventos registrados hoy.</p>
                    <p className="text-sm mt-2">Excelente trabajo! 🎉</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 flex justify-center">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 border border-cyan-400/50 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-sm mb-1">Total de Eventos</p>
                        <p className="text-4xl font-bold text-cyan-300">
                          {todayEvents.length}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {todayEvents.map((e, i) => (
                        <li
                          key={i}
                          className="bg-black/30 border border-cyan-400/30 rounded-lg p-4 flex justify-between items-start hover:border-cyan-400 transition"
                        >
                          <div className="flex-1">
                            <span className="text-cyan-200 font-semibold block text-lg">
                              {e.title || "Evento de Somnolencia"}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {e.description || "Detección automática"}
                            </span>
                          </div>

                          <span className="text-gray-400 text-sm ml-4 whitespace-nowrap">
                            {new Date(e.createdAt).toLocaleTimeString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB: HISTORIAL */}
          {activeTab === "history" && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-8 glow text-cyan-300">
                Historial Reciente
              </h1>

              <Card>
                {loading ? (
                  <p className="text-center text-gray-500">Cargando historial...</p>
                ) : simplifiedHistory.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-lg">No hay historial disponible.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {simplifiedHistory.map((event, index) => {
                      const isSleepy = 
                        event.title?.toLowerCase().includes("sleep") ||
                        event.title?.toLowerCase().includes("somnolencia") ||
                        event.description?.toLowerCase().includes("sleep") ||
                        event.description?.toLowerCase().includes("somnolencia");

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isSleepy
                              ? "bg-pink-900/20 border-pink-400/30"
                              : "bg-green-900/20 border-green-400/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {isSleepy ? "😴" : "👁️"}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-200">
                                {isSleepy ? "Dormido" : "Despierto"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(event.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ${
                            isSleepy ? "text-pink-300" : "text-green-300"
                          }`}>
                            {isSleepy ? "⚠ Alerta" : "✓ OK"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB: PERFIL */}
          {activeTab === "profile" && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-8 glow text-cyan-300">
                Mi Perfil
              </h1>

              <Card className="max-w-2xl">
                {loading ? (
                  <p className="text-center text-gray-500">Cargando perfil...</p>
                ) : !user ? (
                  <p className="text-center text-gray-400 py-4">
                    No se pudo cargar el perfil.
                  </p>
                ) : (
                  <div className="flex flex-col gap-6">
                    {/* Información Básica */}
                    <div>
                      <h3 className="text-xl font-bold text-cyan-300 mb-4">
                        Información Básica
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Nombre Completo</p>
                          <p className="text-xl font-semibold text-cyan-200">
                            {user.name || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Correo Electrónico</p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {user.email || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">ID de Usuario</p>
                          <p className="text-sm font-mono text-green-300">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Información de Conducción */}
                    <div className="border-t border-cyan-400/30 pt-6">
                      <h3 className="text-xl font-bold text-cyan-300 mb-4">
                        Estadísticas
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg text-center">
                          <p className="text-gray-400 text-sm mb-1">
                            Eventos Detectados
                          </p>
                          <p className="text-3xl font-bold text-cyan-300">
                            {events.length}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg text-center">
                          <p className="text-gray-400 text-sm mb-1">
                            Eventos Hoy
                          </p>
                          <p className="text-3xl font-bold text-pink-300">
                            {todayEvents.length}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg text-center">
                          <p className="text-gray-400 text-sm mb-1">
                            Tasa de Alerta
                          </p>
                          <p className="text-3xl font-bold text-yellow-300">
                            {events.length > 0
                              ? ((todayEvents.length / events.length) * 100).toFixed(1)
                              : 0}
                            %
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg text-center">
                          <p className="text-gray-400 text-sm mb-1">
                            Miembro Desde
                          </p>
                          <p className="text-lg font-bold text-green-300">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Información Extendida */}
                    <div className="border-t border-cyan-400/30 pt-6">
                      <h3 className="text-xl font-bold text-cyan-300 mb-4">
                        Detalles Adicionales
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">
                            Cédula/ID Nacional
                          </p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {user.cedula || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Teléfono</p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {user.phone || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Dirección</p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {user.address || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">
                            Número de Licencia
                          </p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {user.licenseNumber || "No especificado"}
                          </p>
                        </div>

                        <div className="bg-black/30 border border-cyan-400/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">
                            Vehículo
                          </p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {user.vehicle || "No especificado"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="border-t border-cyan-400/30 pt-6 flex gap-4">
                      <button
                        onClick={openEdit}
                        className="flex-1 py-3 bg-blue-600/80 hover:bg-blue-700 rounded-lg text-white font-bold transition glow"
                      >
                        Editar Perfil
                      </button>
                      <button
                        onClick={logout}
                        className="flex-1 py-3 bg-red-600/80 hover:bg-red-700 rounded-lg text-white font-bold transition glow"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">
              Editar Información Personal
            </h2>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2 text-cyan-200 focus:border-cyan-400 focus:outline-none transition"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Cédula */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Cédula/ID Nacional
                </label>
                <input
                  type="text"
                  value={editForm.cedula || ""}
                  onChange={(e) => handleEditChange("cedula", e.target.value)}
                  className="w-full bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2 text-cyan-200 focus:border-cyan-400 focus:outline-none transition"
                  placeholder="Ej: 123456789"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editForm.phone || ""}
                  onChange={(e) => handleEditChange("phone", e.target.value)}
                  className="w-full bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2 text-cyan-200 focus:border-cyan-400 focus:outline-none transition"
                  placeholder="Ej: +593 099 123 4567"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={editForm.address || ""}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                  className="w-full bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2 text-cyan-200 focus:border-cyan-400 focus:outline-none transition"
                  placeholder="Tu dirección"
                />
              </div>

              {/* Número de Licencia */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Número de Licencia
                </label>
                <input
                  type="text"
                  value={editForm.licenseNumber || ""}
                  onChange={(e) => handleEditChange("licenseNumber", e.target.value)}
                  className="w-full bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2 text-cyan-200 focus:border-cyan-400 focus:outline-none transition"
                  placeholder="Ej: ABC123456"
                />
              </div>

              {/* Vehículo */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Vehículo (Marca, Modelo, Placa)
                </label>
                <input
                  type="text"
                  value={editForm.vehicle || ""}
                  onChange={(e) => handleEditChange("vehicle", e.target.value)}
                  className="w-full bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2 text-cyan-200 focus:border-cyan-400 focus:outline-none transition"
                  placeholder="Ej: Toyota Camry 2020, ABC-1234"
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={closeEdit}
                disabled={savingProfile}
                className="flex-1 py-3 bg-gray-600/80 hover:bg-gray-700 rounded-lg text-white font-bold transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="flex-1 py-3 bg-green-600/80 hover:bg-green-700 rounded-lg text-white font-bold transition glow disabled:opacity-50"
              >
                {savingProfile ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
