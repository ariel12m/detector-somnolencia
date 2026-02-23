import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  async function loadProfile() {
    const token = localStorage.getItem("token");
      const id=Number(localStorage.getItem('Id'))
    if(token){
    try {
      const res = await api.get(`user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error cargando perfil", error);
    } finally {
      setLoading(false);
    }
  }
    else{
        console.log('Error al cargar perfil')}
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 max-w-lg mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold glow text-center mb-6 text-cyan-300">
          Perfil
        </h1>

        <Card>
          {loading ? (
            <p className="text-center text-gray-500">Cargando perfil...</p>
          ) : !user ? (
            <p className="text-center text-gray-400 py-4">
              No se pudo cargar el perfil.
            </p>
          ) : (
            <div className="flex flex-col gap-4 text-gray-300">
              <div className="bg-black/30 border border-cyan-400/30 p-3 rounded-lg">
                <p><strong className="text-cyan-300">Nombre:</strong> {user.name}</p>
              </div>

              <div className="bg-black/30 border border-cyan-400/30 p-3 rounded-lg">
                <p><strong className="text-cyan-300">Correo:</strong> {user.email}</p>
              </div>

              <button
                onClick={logout}
                className="mt-4 w-full py-2 bg-pink-600 hover:bg-pink-500 
                rounded-lg text-white glow transition"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
