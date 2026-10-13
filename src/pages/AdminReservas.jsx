import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservaCard from "../components/ReservaCard";
import EditReservaModal from "../utils/EditReservaModal";
import ConfirmDialog from "../components/ConfirmDialog";
import InfoClienteModal from "../utils/InfoClienteModal";
import {
  getReservas,
  updateEstadoReserva,
  updateReserva,
  deleteReserva,
} from "../services/api";
import "../assets/css/AdminReservas.css";
import{logout} from "../services/authapi";

const FILTROS = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
  { valor: "finalizada", etiqueta: "Finalizadas" },
];

const MONEDA = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function obtenerFechaLocal(fecha) {
  if (!fecha) return null;
  const [ano, mes, dia] = String(fecha).slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return null;
  const fechaLocal = new Date(ano, mes - 1, dia);
  return Number.isNaN(fechaLocal.getTime()) ? null : fechaLocal;
}

function formatoFecha(fecha) {
  const fechaLocal = obtenerFechaLocal(fecha);
  if (!fechaLocal) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(fechaLocal);
}

function esReservaFinalizada(reserva, hoy) {
  if (reserva.estado === "completada" || reserva.estado === "finalizada") return true;
  const fechaEvento = obtenerFechaLocal(reserva.reserva?.fecha_evento);
  return reserva.estado === "confirmada" && fechaEvento && fechaEvento < hoy;
}

function obtenerNombre(reserva) {
  return reserva.reserva?.nombre_completo || "Cliente sin nombre";
}

function TarjetaResumen({ titulo, valor, detalle, variante }) {
  return (
    <article className={`reservas-resumen__tarjeta reservas-resumen__tarjeta--${variante}`}>
      <span className="reservas-resumen__etiqueta">{titulo}</span>
      <strong className="reservas-resumen__valor">{valor}</strong>
      <span className="reservas-resumen__detalle">{detalle}</span>
    </article>
  );
}

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [reservaEnEdicion, setReservaEnEdicion] = useState(null);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [reservaInfo, setReservaInfo] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const navigate = useNavigate();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);


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

  function manejarBuscar(e) {
    e.preventDefault();
    setBusquedaAplicada(busqueda.trim().toLowerCase());
  }


  const reservasFiltradas = reservas
  .filter((r) => {
    if (filtro === "todas") return true;

    if (filtro === "finalizada") return esReservaFinalizada(r, hoy);

    return r.estado === filtro;
  })
  .filter((r) =>
    busquedaAplicada
      ? [r.reserva?.nombre_completo, r.reserva?.email, r.reserva?.telefono]
          .some((campo) => campo?.toLowerCase().includes(busquedaAplicada))
      : true
  );

  const conteoEstados = reservas.reduce(
    (conteo, reserva) => {
      if (reserva.estado === "pendiente") conteo.pendientes += 1;
      else if (reserva.estado === "confirmada") {
        if (esReservaFinalizada(reserva, hoy)) conteo.finalizadas += 1;
        else conteo.confirmadas += 1;
      } else if (reserva.estado === "completada" || reserva.estado === "finalizada") {
        conteo.finalizadas += 1;
      } else if (reserva.estado === "cancelada") conteo.canceladas += 1;
      return conteo;
    },
    { pendientes: 0, confirmadas: 0, canceladas: 0, finalizadas: 0 },
  );

  const importePrevisto = reservas.reduce((total, reserva) => {
    if (reserva.estado !== "pendiente" && reserva.estado !== "confirmada") return total;
    return total + (Number(reserva.total) || 0);
  }, 0);

  const reservasActivasProximas = reservas
    .filter((reserva) => {
      const fechaEvento = obtenerFechaLocal(reserva.reserva?.fecha_evento);
      return (
        fechaEvento &&
        fechaEvento >= hoy &&
        (reserva.estado === "pendiente" || reserva.estado === "confirmada")
      );
    })
    .sort(
      (a, b) =>
        obtenerFechaLocal(a.reserva.fecha_evento) -
        obtenerFechaLocal(b.reserva.fecha_evento),
    );
  const reservasProximas = reservasActivasProximas.slice(0, 5);

  const totalEstados = reservas.length || 1;

  return (
    <div className="admin-reservas">
      <button
        className="btn-cerrar"
        onClick={async () => {
          await logout();
          navigate("/");
          sessionStorage.removeItem("user");
        }}
      >
        Cerrar sesión
      </button>
      <header className="admin-reservas__header">
        <div>
          <span className="admin-reservas__eyebrow">PANEL DE GESTIÓN</span>
          <h1>Reservas de la sala</h1>
          <p>Organiza los eventos y controla de un vistazo su estado y facturación.</p>
        </div>
        <div className="admin-reservas__header-acciones">
          <span className="admin-reservas__fecha">
            {new Intl.DateTimeFormat("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(hoy)}
          </span>
          <button
            className="btn btn--primario"
            onClick={() => navigate("/finanzas")}
          >
            Ver finanzas
          </button>
        </div>
      </header>

      {!cargando && !error && (
        <>
      <section className="reservas-resumen" aria-label="Resumen de reservas">
        <TarjetaResumen
          titulo="Reservas registradas"
          valor={reservas.length}
          detalle="Total en el sistema"
          variante="total"
        />
        <TarjetaResumen
          titulo="Próximos eventos"
          valor={reservasActivasProximas.length}
          detalle="Pendientes y confirmadas"
          variante="proximas"
        />
        <TarjetaResumen
          titulo="Pendientes de confirmar"
          valor={conteoEstados.pendientes}
          detalle="Requieren seguimiento"
          variante="pendientes"
        />
        <TarjetaResumen
          titulo="Importe previsto"
          valor={MONEDA.format(importePrevisto)}
          detalle="Reservas activas"
          variante="importe"
        />
      </section>

      <section className="reservas-panel-estados" aria-label="Estado de las reservas">
        <div className="reservas-panel-estados__encabezado">
          <div>
            <h2>Estado de las reservas</h2>
            <p>Distribución del total registrado</p>
          </div>
          <strong>{reservas.length} en total</strong>
        </div>
        <div className="reservas-panel-estados__barra" role="img" aria-label="Distribución por estado">
          <span className="reservas-panel-estados__segmento reservas-panel-estados__segmento--confirmadas"
            style={{ width: `${(conteoEstados.confirmadas / totalEstados) * 100}%` }} />
          <span className="reservas-panel-estados__segmento reservas-panel-estados__segmento--pendientes"
            style={{ width: `${(conteoEstados.pendientes / totalEstados) * 100}%` }} />
          <span className="reservas-panel-estados__segmento reservas-panel-estados__segmento--finalizadas"
            style={{ width: `${(conteoEstados.finalizadas / totalEstados) * 100}%` }} />
          <span className="reservas-panel-estados__segmento reservas-panel-estados__segmento--canceladas"
            style={{ width: `${(conteoEstados.canceladas / totalEstados) * 100}%` }} />
        </div>
        <div className="reservas-panel-estados__leyenda">
          <span><i className="reservas-panel-estados__punto reservas-panel-estados__punto--confirmadas" />Confirmadas <b>{conteoEstados.confirmadas}</b></span>
          <span><i className="reservas-panel-estados__punto reservas-panel-estados__punto--pendientes" />Pendientes <b>{conteoEstados.pendientes}</b></span>
          <span><i className="reservas-panel-estados__punto reservas-panel-estados__punto--finalizadas" />Finalizadas <b>{conteoEstados.finalizadas}</b></span>
          <span><i className="reservas-panel-estados__punto reservas-panel-estados__punto--canceladas" />Canceladas <b>{conteoEstados.canceladas}</b></span>
        </div>
      </section>

      <section className="reservas-proximas" aria-label="Próximos eventos">
        <div className="reservas-proximas__encabezado">
          <div>
            <h2>Próximos eventos</h2>
            <p>Las siguientes reservas pendientes o confirmadas</p>
          </div>
          <span>{reservasProximas.length} próximas</span>
        </div>
        {reservasProximas.length > 0 ? (
          <div className="reservas-proximas__lista">
            {reservasProximas.map((reserva) => (
              <button
                type="button"
                className="reservas-proximas__fila"
                key={reserva.id}
                onClick={() => setReservaInfo(reserva)}
                aria-label={`Ver datos de ${obtenerNombre(reserva)}, ${formatoFecha(reserva.reserva?.fecha_evento)}`}
              >
                <span className="reservas-proximas__fecha">{formatoFecha(reserva.reserva?.fecha_evento)}</span>
                <span className="reservas-proximas__cliente">{obtenerNombre(reserva)}</span>
                <span className="reservas-proximas__hora">{reserva.reserva?.hora_entrada || "Hora por confirmar"}</span>
                <span className={`reservas-proximas__estado reservas-proximas__estado--${reserva.estado}`}>
                  {reserva.estado === "confirmada" ? "Confirmada" : "Pendiente"}
                </span>
                <strong>{MONEDA.format(Number(reserva.total) || 0)}</strong>
              </button>
            ))}
          </div>
        ) : (
          <p className="reservas-proximas__vacio">No hay eventos próximos pendientes o confirmados.</p>
        )}
      </section>
        </>
      )}

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

      <form className="admin-reservas__buscador" onSubmit={manejarBuscar}>
        <input
          type="text"
          className="admin-reservas__buscador-input"
          aria-label="Buscar reservas por nombre, correo o teléfono"
          placeholder="Buscar por nombre, correo o teléfono…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit" className="btn btn--primario">
          Buscar
        </button>
      </form>

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
