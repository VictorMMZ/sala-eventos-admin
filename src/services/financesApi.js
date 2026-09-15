const API_BASE = "http://localhost:8000/api/finanzas";

export async function getFinanzas() {
  const res = await fetch(API_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudieron cargar los datos financieros");
  return res.json();

}
