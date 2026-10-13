import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getFinanzas } from "../services/financesApi";
import "../assets/css/Finanzas.css";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    Number(valor) || 0,
  );

const formatoNumero = (valor) =>
  new Intl.NumberFormat("es-ES").format(Number(valor) || 0);

function IndicadorFinanciero({ titulo, valor, detalle, icono, variante }) {
  return (
    <article className={`finanzas-indicador finanzas-indicador--${variante}`}>
      <span className="finanzas-indicador__icono" aria-hidden="true">{icono}</span>
      <span className="finanzas-indicador__titulo">{titulo}</span>
      <strong className="finanzas-indicador__valor">{valor}</strong>
      <span className="finanzas-indicador__detalle">{detalle}</span>
    </article>
  );
}

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

  const datosGrafica = datos
    ? [
        {
          periodo: "Semana",
          Facturado: Number(datos.total_facturado_semana) || 0,
          Esperado: Number(datos.total_facturado_semana_esperado) || 0,
        },
        {
          periodo: "Mes",
          Facturado: Number(datos.total_facturado_mes) || 0,
          Esperado: Number(datos.total_facturado_mes_esperado) || 0,
        },
        {
          periodo: "Año",
          Facturado: Number(datos.total_facturado_ano) || 0,
          Esperado: Number(datos.total_facturado_ano_esperado) || 0,
        },
      ]
    : [];

  const facturadoHistorico = Number(datos?.total_facturado) || 0;
  const esperadoHistorico = Number(datos?.total_facturado_esperado) || 0;
  const importePendiente = Math.max(esperadoHistorico - facturadoHistorico, 0);
  const porcentajeFacturado = esperadoHistorico > 0
    ? Math.min((facturadoHistorico / esperadoHistorico) * 100, 100)
    : 0;

  return (
    <div className="finanzas">
      <header className="finanzas__header">
        <div>
          <span className="finanzas__eyebrow">ANÁLISIS FINANCIERO</span>
          <h1>Finanzas</h1>
          <p>Consulta la facturación confirmada, las previsiones y la actividad por periodo.</p>
        </div>
        <div className="finanzas__header-acciones">
          <span className="finanzas__fecha">
            Actualizado {new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </span>
          <button className="btn btn--primario" onClick={() => navigate("/dashboard")}>
            Volver a reservas
          </button>
        </div>
      </header>

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
          <section className="finanzas-indicadores" aria-label="Resumen financiero">
            <IndicadorFinanciero
              titulo="Facturado histórico"
              valor={formatoMoneda(facturadoHistorico)}
              detalle="Eventos confirmados ya celebrados"
              icono="€"
              variante="facturado"
            />
            <IndicadorFinanciero
              titulo="Previsión histórica"
              valor={formatoMoneda(esperadoHistorico)}
              detalle="Reservas pendientes y confirmadas"
              icono="↗"
              variante="esperado"
            />
            <IndicadorFinanciero
              titulo="Por realizar"
              valor={formatoMoneda(importePendiente)}
              detalle="Previsión menos facturación confirmada"
              icono="◷"
              variante="pendiente"
            />
            <IndicadorFinanciero
              titulo="Reservas este año"
              valor={formatoNumero(datos.total_reservas_ano)}
              detalle={`${formatoNumero(datos.total_reservas_mes)} este mes`}
              icono="▦"
              variante="reservas"
            />
          </section>

          <section className="finanzas-progreso" aria-label="Progreso de facturación">
            <div className="finanzas-progreso__texto">
              <div>
                <h2>Facturación confirmada</h2>
                <p>Proporción respecto a la previsión histórica</p>
              </div>
              <strong>{formatoNumero(porcentajeFacturado)}%</strong>
            </div>
            <div
              className="finanzas-progreso__pista"
              role="progressbar"
              aria-label="Porcentaje de facturación confirmada sobre la previsión"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(porcentajeFacturado)}
            >
              <span style={{ width: `${porcentajeFacturado}%` }} />
            </div>
            <div className="finanzas-progreso__importes">
              <span>Confirmado: <b>{formatoMoneda(facturadoHistorico)}</b></span>
              <span>Previsión: <b>{formatoMoneda(esperadoHistorico)}</b></span>
            </div>
          </section>

          <section className="finanzas__grafica">
            <div className="finanzas__grafica-encabezado">
              <div>
                <h2>Facturación por periodo</h2>
                <p>Comparativa de importes facturados y previstos</p>
              </div>
              <div className="finanzas__leyenda">
                <span className="finanzas__leyenda-item">
                  <span className="finanzas__leyenda-punto finanzas__leyenda-punto--facturado" />
                  Facturado
                </span>
                <span className="finanzas__leyenda-item">
                  <span className="finanzas__leyenda-punto finanzas__leyenda-punto--esperado" />
                  Esperado
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={datosGrafica} margin={{ top: 12, right: 12, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5ebf3" vertical={false} />
                <XAxis dataKey="periodo" stroke="#61718a" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#61718a"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatoMoneda(v)}
                  width={90}
                />
                <Tooltip
                  formatter={(valor, nombre) => [formatoMoneda(valor), nombre]}
                  cursor={{ fill: "rgba(8, 126, 154, 0.06)" }}
                />
                <Legend />
                <Bar dataKey="Facturado" fill="#087e9a" radius={[6, 6, 0, 0]} maxBarSize={54} />
                <Bar dataKey="Esperado" fill="#806bd1" radius={[6, 6, 0, 0]} maxBarSize={54} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="finanzas__periodos" aria-label="Detalle financiero por periodo">
            <section className="finanzas__bloque">
              <div className="finanzas__bloque-encabezado">
                <div><span>01</span><h2>Hoy</h2></div>
                <p>Actividad del día</p>
              </div>
              <div className="finanzas__grid">
                <StatCard titulo="Facturado hoy" valor={formatoMoneda(datos.total_facturado_dia)} subtitulo="Eventos confirmados" tipo="facturado" />
                <StatCard titulo="Esperado hoy" valor={formatoMoneda(datos.total_facturado_dia_esperado)} subtitulo="Reservas activas" tipo="esperado" />
                <StatCard titulo="Reservas hoy" valor={formatoNumero(datos.total_reservas_dia)} subtitulo="Eventos confirmados" tipo="reservas" />
              </div>
            </section>

            <section className="finanzas__bloque">
              <div className="finanzas__bloque-encabezado">
                <div><span>02</span><h2>Esta semana</h2></div>
                <p>Ritmo semanal</p>
              </div>
              <div className="finanzas__grid">
                <StatCard titulo="Facturado esta semana" valor={formatoMoneda(datos.total_facturado_semana)} subtitulo="Eventos confirmados" tipo="facturado" />
                <StatCard titulo="Esperado esta semana" valor={formatoMoneda(datos.total_facturado_semana_esperado)} subtitulo="Reservas activas" tipo="esperado" />
                <StatCard titulo="Reservas esta semana" valor={formatoNumero(datos.total_reservas_semana)} subtitulo="Eventos confirmados" tipo="reservas" />
              </div>
            </section>

            <section className="finanzas__bloque">
              <div className="finanzas__bloque-encabezado">
                <div><span>03</span><h2>Este mes</h2></div>
                <p>Balance mensual</p>
              </div>
              <div className="finanzas__grid">
                <StatCard titulo="Facturado este mes" valor={formatoMoneda(datos.total_facturado_mes)} subtitulo="Eventos confirmados ya celebrados" tipo="facturado" />
                <StatCard titulo="Esperado este mes" valor={formatoMoneda(datos.total_facturado_mes_esperado)} subtitulo="Reservas activas del mes" tipo="esperado" />
                <StatCard titulo="Reservas este mes" valor={formatoNumero(datos.total_reservas_mes)} subtitulo="Eventos confirmados" tipo="reservas" />
              </div>
            </section>

            <section className="finanzas__bloque">
              <div className="finanzas__bloque-encabezado">
                <div><span>04</span><h2>Este año</h2></div>
                <p>Balance anual</p>
              </div>
              <div className="finanzas__grid">
                <StatCard titulo="Facturado este año" valor={formatoMoneda(datos.total_facturado_ano)} subtitulo="Eventos confirmados ya celebrados" tipo="facturado" />
                <StatCard titulo="Esperado este año" valor={formatoMoneda(datos.total_facturado_ano_esperado)} subtitulo="Reservas activas del año" tipo="esperado" />
                <StatCard titulo="Reservas este año" valor={formatoNumero(datos.total_reservas_ano)} subtitulo="Eventos confirmados" tipo="reservas" />
              </div>
            </section>
          </section>
        </>
      )}
    </div>
  );
}
