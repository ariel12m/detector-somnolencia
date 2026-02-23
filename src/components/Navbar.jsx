import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center 
      bg-[#0a001a]/70 backdrop-blur-md border-b border-cyan-400/30 shadow-md neon-glow">
      
      <h1 className="text-3xl font-bold glow text-cyan-300 drop-shadow-lg">
        Somnolencia 
      </h1>

      <div className="flex gap-6 text-lg">
        <Link className="hover:text-cyan-300 hover:glow transition" to="/dashboard">Dashboard</Link>
        <Link className="hover:text-cyan-300 hover:glow transition" to="/events-today">Eventos Hoy</Link>
        <Link className="hover:text-cyan-300 hover:glow transition" to="/history">Historial</Link>
        <Link className="hover:text-pink-300 hover:glow transition" to="/profile">Perfil</Link>

        {}
        {
        <button 
          onClick={handleLogout}
          className="bg-red-600/80 px-3 py-1 rounded-md hover:bg-red-700 transition text-white"
        >
          Logout
        </button>
        }
      </div>
    </nav>
  );
}
