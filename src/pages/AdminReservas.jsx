import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservaCard from "../components/ReservaCard";
import EditReservaModal from "../utils/EditReservaModal";
import ConfirmDialog from "../utils/ConfirmDialog";
import InfoClienteModal from "../utils/InfoClienteModal";
import {
  getReservas,
  updateEstadoReserva,
  updateReserva,
  deleteReserva,
} from "../services/api";
import "../assets/css/AdminReservas.css";

const FILTROS = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
];

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [reservaEnEdicion, setReservaEnEdicion] = useState(null);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [reservaInfo, setReservaInfo] = useState(null);
  const [aviso, setAviso] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  useEffect(() => {
    cargarReservas();
  }, []);

  async function cargarReservas() {
    try {
      setCargando(true);
      setError(null);
      const datos = await getReservas();
      setReservas(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambioEstado(id, nuevoEstado) {
    const anterior = reservas;
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)),
    );
    try {
      await updateEstadoReserva(id, nuevoEstado);
      if (nuevoEstado === "confirmada" || nuevoEstado === "cancelada") {
        setAviso(
          nuevoEstado === "confirmada"
            ? "Reserva confirmada. Se ha avisado al cliente por email."
            : "Reserva cancelada. Se ha avisado al cliente por email.",
        );
      }
    } catch (err) {
      setReservas(anterior);
      alert("No se pudo cambiar el estado: " + err.message);
    }
  }

  async function manejarGuardarEdicion(datosActualizados) {
    try {
      await updateReserva(datosActualizados.id, datosActualizados);
      setReservas((prev) =>
        prev.map((r) =>
          r.id === datosActualizados.id ? datosActualizados : r,
        ),
      );
      setReservaEnEdicion(null);
    } catch (err) {
      alert("No se pudo guardar: " + err.message);
    }
  }

  async function manejarConfirmarEliminar() {
    try {
      await deleteReserva(idAEliminar);
      setReservas((prev) => prev.filter((r) => r.id !== idAEliminar));
    } catch (err) {
      alert("No se pudo eliminar: " + err.message);
    } finally {
      setIdAEliminar(null);
    }
  }

  const reservasFiltradas =
    filtro === "todas" ? reservas : reservas.filter((r) => r.estado === filtro);

  return (
    <div className="admin-reservas">
      <header className="admin-reservas__header">
        <h1>Reservas de la sala</h1>
        <p>Gestiona las fechas, el estado y los importes de cada evento.</p>
        <button
          className="btn btn--primario"
          onClick={() => navigate("/finanzas")}
        >
          Finanzas
        </button>
      </header>

      <nav className="admin-reservas__filtros">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            className={`filtro ${filtro === f.valor ? "filtro--activo" : ""}`}
            onClick={() => setFiltro(f.valor)}
          >
            {f.etiqueta}
          </button>
        ))}
      </nav>

      {aviso && <div className="admin-reservas__aviso">{aviso}</div>}

      {cargando && (
        <p className="admin-reservas__mensaje">Cargando reservas…</p>
      )}

      {error && (
        <div className="admin-reservas__error">
          <p>No se pudieron cargar las reservas: {error}</p>
          <button className="btn btn--primario" onClick={cargarReservas}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && reservasFiltradas.length === 0 && (
        <p className="admin-reservas__mensaje">
          No hay reservas en esta categoría todavía.
        </p>
      )}

      {!cargando && !error && reservasFiltradas.length > 0 && (
        <div className="admin-reservas__lista">
          {reservasFiltradas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onCambiarEstado={manejarCambioEstado}
              onEditar={setReservaEnEdicion}
              onEliminar={setIdAEliminar}
              onVerInfo={setReservaInfo}
            />
          ))}
        </div>
      )}

      <InfoClienteModal
        visible={reservaInfo !== null}
        reservaAdmin={reservaInfo}
        onCerrar={() => setReservaInfo(null)}
      />

      <EditReservaModal
        reserva={reservaEnEdicion}
        onGuardar={manejarGuardarEdicion}
        onCerrar={() => setReservaEnEdicion(null)}
      />

      <ConfirmDialog
        visible={idAEliminar !== null}
        mensaje="¿Seguro que quieres eliminar esta reserva? No se puede deshacer."
        onConfirmar={manejarConfirmarEliminar}
        onCancelar={() => setIdAEliminar(null)}
      />
    </div>
  );
}
