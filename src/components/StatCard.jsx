export default function StatCard({ titulo, valor, subtitulo, destacada, tipo }) {
  return (
    <div
      className={`stat-card ${destacada ? "stat-card--destacada" : ""} ${
        tipo ? `stat-card--${tipo}` : ""
      }`}
    >
      <span className="stat-card__titulo">{titulo}</span>
      <span className="stat-card__valor">{valor}</span>
      {subtitulo && <span className="stat-card__sub">{subtitulo}</span>}
    </div>
  );
}
