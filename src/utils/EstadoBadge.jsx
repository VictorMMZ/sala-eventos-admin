const ESTILOS = {
  pendiente: { clase: "estado-badge--pendiente", etiqueta: "Pendiente" },
  confirmado: { clase: "estado-badge--confirmado", etiqueta: "Confirmado" },
  cancelado: { clase: "estado-badge--cancelado", etiqueta: "Cancelado" },
};

export default function EstadoBadge({ estado }) {
  const estilo = ESTILOS[estado] || ESTILOS.pendiente;
  return (
    <span className={`estado-badge ${estilo.clase}`}>{estilo.etiqueta}</span>
  );
}
