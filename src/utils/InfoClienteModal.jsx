
const CLAVE_RELACION = "reserva";

const etiquetar = (clave) =>
  clave
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());

export default function InfoClienteModal({ visible, reservaAdmin, onCerrar }) {
  if (!visible || !reservaAdmin) return null;

  const cliente = reservaAdmin[CLAVE_RELACION];

  const campos = cliente
    ? Object.entries(cliente).filter(
        ([clave, valor]) => clave !== "id" && valor !== null && valor !== ""
      )
    : [];

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Datos del cliente</h2>

        {!cliente && (
          <p className="admin-reservas__mensaje">
            Esta reserva no tiene datos de cliente asociados.
          </p>
        )}

        {cliente && campos.length > 0 && (
          <dl className="cliente-info">
            {campos.map(([clave, valor]) => (
              <div className="cliente-info__fila" key={clave}>
                <dt>{etiquetar(clave)}</dt>
                <dd>{String(valor)}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="modal__acciones">
          <button className="btn btn--secundario" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
