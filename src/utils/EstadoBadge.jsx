const ESTILOS = {
  pendiente: { clase: "estado-badge--pendiente", etiqueta: "Pendiente" },
  confirmada: { clase: "estado-badge--confirmado", etiqueta: "Confirmado" },
  cancelada: { clase: "estado-badge--cancelado", etiqueta: "Cancelado" },
};

export default function EstadoBadge({ estado }) {
  const estilo = ESTILOS[estado] || ESTILOS.pendiente;
  return (
    <span className={`estado-badge ${estilo.clase}`}>{estilo.etiqueta}</span>
  );
}
