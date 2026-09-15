// Ajusta esta URL si tu servidor Laravel corre en otro puerto o dominio.
const API_BASE_ADMIN = "http://127.0.0.1:8000/api/adminreservas";


export async function getReservas() {
  const res = await fetch(API_BASE_ADMIN);
  if (!res.ok) throw new Error("No se pudieron cargar las reservas");
  return res.json();
}


export async function updateEstadoReserva(id, estado) {
  const res = await fetch(`${API_BASE_ADMIN}/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el estado");
  return res.json();
}

export async function updateReserva(id, datos) {
  const res = await fetch(`${API_BASE_ADMIN}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("No se pudo actualizar la reserva");
  return res.json();
}

export async function deleteReserva(id) {
  const res = await fetch(`${API_BASE_ADMIN}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar la reserva");
  return true;
}
