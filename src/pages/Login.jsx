import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Card from "../components/Card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data
      localStorage.setItem("token", token);
      localStorage.setItem("Id", user.id)
      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas o error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 animate-fadeIn">
      <Card>
        <h1 className="text-3xl font-bold text-center mb-6 glow text-cyan-300">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo"
            className="input-neon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="input-neon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`button-neon w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300">
          ¿No tienes cuenta?
          <span
            className="text-[#39ff14] cursor-pointer hover:glow ml-1"
            onClick={() => navigate("/register")}
          >
            Regístrate
          </span>
        </p>
      </Card>
    </div>
  );
}
