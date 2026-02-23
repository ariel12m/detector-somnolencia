export default function Card({ title, description, children, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="
        neon-card
        bg-[#0f1629]/70
        backdrop-blur-lg
        card-hover
        rounded-xl
        p-6
        w-full
        max-w-md
        mx-auto
        my-4
        cursor-pointer
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400
      "
    >
      {/* Título */}
      {title && (
        <h2 className="text-2xl font-bold text-cyan-300 mb-2 glow">
          {title}
        </h2>
      )}

      {/* Descripción */}
      {description && (
        <p className="text-gray-300 mb-2">
          {description}
        </p>
      )}

      {/* Contenido personalizado */}
      {children}
    </div>
  );
}
