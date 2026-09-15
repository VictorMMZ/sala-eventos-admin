import { useEffect, useState } from "react";

export default function EditReservaModal({ reserva, onGuardar, onCerrar }) {
  const [form, setForm] = useState(reserva);

  useEffect(() => {
    setForm(reserva);
  }, [reserva]);

  if (!reserva || !form) return null;

  const total =
    (Number(form.precio) || 0) - (Number(form.descuento) || 0);

  const actualizarCampo = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const manejarSubmit = (e) => {
    e.preventDefault();
    onGuardar({ ...form, total });
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={manejarSubmit}>
        <h2>Editar reserva #{form.id}</h2>


        <label>
          Precio (€)
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={(e) => actualizarCampo("precio", e.target.value)}
            required
          />
        </label>

        <label>
          Descuento (€)
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.descuento}
            onChange={(e) => actualizarCampo("descuento", e.target.value)}
          />
        </label>

        <label>
          Fianza (€)
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.fianza}
            onChange={(e) => actualizarCampo("fianza", e.target.value)}
          />
        </label>

        <p className="modal__total">Total: {total.toFixed(2)} €</p>
        <label>
          Total (€)
          <input
            type="number"
            step="0.01"
            min="0"
            value={total.toFixed(2)}
            onChange={(e) => actualizarCampo("total", e.target.value)}
            required
          />
        </label>

        <div className="modal__acciones">
          <button type="button" className="btn btn--secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primario">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
