import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getFinanzas } from "../services/financesApi";
import "../assets/css/Finanzas.css";
import { useNavigate } from "react-router-dom";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    Number(valor) || 0,
  );

const formatoNumero = (valor) =>
  new Intl.NumberFormat("es-ES").format(Number(valor) || 0);

export default function Finanzas() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError(null);
      const res = await getFinanzas();
      setDatos(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="finanzas">
      <header className="finanzas__header">
        <h1>Finanzas</h1>
        <p>Resumen de facturación y reservas de la sala.</p>
        <button className="btn btn--primario" onClick={() => navigate("/dashboard")}>
          Reservas
        </button>
      </header>

      {!cargando && !error && (
        <div className="finanzas__leyenda">
          <span className="finanzas__leyenda-item">
            <span className="finanzas__leyenda-punto finanzas__leyenda-punto--facturado" />
            Facturado (confirmado)
          </span>
          <span className="finanzas__leyenda-item">
            <span className="finanzas__leyenda-punto finanzas__leyenda-punto--esperado" />
            Esperado
          </span>
          <span className="finanzas__leyenda-item">
            <span className="finanzas__leyenda-punto finanzas__leyenda-punto--reservas" />
            Reservas
          </span>
        </div>
      )}

      {cargando && (
        <p className="finanzas__mensaje">Cargando datos financieros…</p>
      )}

      {error && (
        <div className="finanzas__error">
          <p>No se pudieron cargar los datos: {error}</p>
          <button className="btn btn--primario" onClick={cargarDatos}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && datos && (
        <>
          <div className="finanzas__resumen finanzas__resumen--doble">
            <StatCard
              titulo="Facturado confirmado (histórico)"
              valor={formatoMoneda(datos.total_facturado)}
              subtitulo="Reservas confirmadas con evento ya realizado"
              tipo="facturado"
              destacada
            />
            <StatCard
              titulo="Total esperado (histórico)"
              valor={formatoMoneda(datos.total_facturado_esperado)}
              subtitulo="Todas las reservas, sin filtrar por estado"
              tipo="esperado"
            />
          </div>

          <div className="finanzas__periodos">
            <section className="finanzas__bloque">
              <h2>Hoy</h2>
              <div className="finanzas__grid">
                <StatCard
                  titulo="Facturado hoy"
                  valor={formatoMoneda(datos.total_facturado_dia)}
                  tipo="facturado"
                />
                <StatCard
                  titulo="Esperado hoy"
                  valor={formatoMoneda(datos.total_facturado_dia_esperado)}
                  tipo="esperado"
                />
                <StatCard
                  titulo="Reservas hoy"
                  valor={formatoNumero(datos.total_reservas_dia)}
                  tipo="reservas"
                />
              </div>
            </section>

            <section className="finanzas__bloque">
              <h2>Esta semana</h2>
              <div className="finanzas__grid">
                <StatCard
                  titulo="Facturado esta semana"
                  valor={formatoMoneda(datos.total_facturado_semana)}
                  tipo="facturado"
                />
                <StatCard
                  titulo="Esperado esta semana"
                  valor={formatoMoneda(datos.total_facturado_semana_esperado)}
                  tipo="esperado"
                />
                <StatCard
                  titulo="Reservas esta semana"
                  valor={formatoNumero(datos.total_reservas_semana)}
                  tipo="reservas"
                />
              </div>
            </section>

            <section className="finanzas__bloque">
              <h2>Este mes</h2>
              <div className="finanzas__grid">
                <StatCard
                  titulo="Facturado este mes"
                  valor={formatoMoneda(datos.total_facturado_mes)}
                  tipo="facturado"
                />
                <StatCard
                  titulo="Esperado este mes"
                  valor={formatoMoneda(datos.total_facturado_mes_esperado)}
                  tipo="esperado"
                />
                <StatCard
                  titulo="Reservas este mes"
                  valor={formatoNumero(datos.total_reservas_mes)}
                  tipo="reservas"
                />
              </div>
            </section>

            <section className="finanzas__bloque">
              <h2>Este año</h2>
              <div className="finanzas__grid">
                <StatCard
                  titulo="Facturado este año"
                  valor={formatoMoneda(datos.total_facturado_ano)}
                  tipo="facturado"
                />
                <StatCard
                  titulo="Esperado este año"
                  valor={formatoMoneda(datos.total_facturado_ano_esperado)}
                  tipo="esperado"
                />
                <StatCard
                  titulo="Reservas este año"
                  valor={formatoNumero(datos.total_reservas_ano)}
                  tipo="reservas"
                />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
