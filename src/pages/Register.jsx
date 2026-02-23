import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Card from "../components/Card";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Estado para manejar errores visualmente

  // Manejador único para todos los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Limpiar error mientras el usuario escribe
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", form);
      navigate("/login"); 
    } catch (err) {
      // Intentamos obtener el mensaje de error del backend si existe
      const msg = err.response?.data?.message || "Error al registrar. Verifica tu información.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 animate-fadeIn">
      <Card>
        <h1 className="text-3xl font-bold text-center mb-6 glow text-pink-400">
          Crear Cuenta
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name" // Agregamos el atributo name
            type="text"
            placeholder="Nombre completo"
            className="input-neon"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Correo"
            className="input-neon"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="input-neon"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6} // Validación básica de HTML5
          />

          {/* Mostrar error si existe */}
          {error && <p className="text-red-400 text-sm text-center font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`button-neon w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300">
          ¿Ya tienes cuenta?
          <span
            className="text-cyan-300 cursor-pointer hover:underline ml-1"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </Card>
    </div>
  );
}