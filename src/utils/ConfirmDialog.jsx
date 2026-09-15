export default function ConfirmDialog({ visible, mensaje, onConfirmar, onCancelar }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal modal--pequeno" onClick={(e) => e.stopPropagation()}>
        <p>{mensaje}</p>
        <div className="modal__acciones">
          <button className="btn btn--secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn--peligro" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
