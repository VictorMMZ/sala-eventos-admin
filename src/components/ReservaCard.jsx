import EstadoBadge from "../utils/EstadoBadge";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    Number(valor) || 0
  );

const formatoDia = (dia) => {
  const fecha = new Date(`${dia}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return dia;
  return fecha.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export default function ReservaCard({ reserva, onCambiarEstado, onEditar, onEliminar, onVerInfo }) {
  const { id,  precio, descuento, fianza, total, estado, reserva: { nombre_completo,fecha_evento, hora_entrada }
} = reserva;

  return (
    <article className="ticket">
      <div className="ticket__cuerpo">
        <div className="ticket__id">
          <span className="ticket__id-numero">#{id}</span>
          <span className="ticket__fecha">{formatoDia(fecha_evento)}</span>
          <span className="ticket__hora">{hora_entrada}</span>
          <span className="ticket__nombre">{nombre_completo}</span>
        </div>

        <EstadoBadge estado={estado} />
      </div>

      <div className="ticket__perforacion" aria-hidden="true"></div>

      <div className="ticket__cuerpo ticket__importes">
        <dl className="ticket__linea">
          <dt>Precio</dt>
          <dd>{formatoMoneda(precio)}</dd>
        </dl>
        <dl className="ticket__linea">
          <dt>Descuento</dt>
          <dd>&minus; {formatoMoneda(descuento)}</dd>
        </dl>
        <dl className="ticket__linea">
          <dt>Fianza</dt>
          <dd>{formatoMoneda(fianza)}</dd>
        </dl>
        <dl className="ticket__linea ticket__linea--total">
          <dt>Total</dt>
          <dd>{formatoMoneda(total)}</dd>
        </dl>

        <div className="ticket__acciones">
          <select
            className="ticket__select"
            value={estado}
            onChange={(e) => onCambiarEstado(id, e.target.value)}
            aria-label={`Cambiar estado de la reserva ${id}`}
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmado</option>
            <option value="cancelada">Cancelado</option>
          </select>
          <button className="btn btn--info" onClick={() => onVerInfo(reserva)}>
            Ver información
          </button>
          <button className="btn btn--editar" onClick={() => onEditar(reserva)}>
            Editar
          </button>
          <button className="btn btn--peligro" onClick={() => onEliminar(id)}>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
