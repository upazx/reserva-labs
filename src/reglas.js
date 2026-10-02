// reglas.js — la LÓGICA PURA de Reserva de labs, sin Express ni HTTP de por medio.
// Son funciones que reciben datos y devuelven un resultado, nada más.
// Por eso se prueban con pruebas UNITARIAS (la base de la pirámide): rápidas y aisladas.

// ¿Dos reservas de la MISMA sala se pisan en el horario?
// Se solapan si una empieza antes de que la otra termine, y viceversa.
// Nota: si una termina justo cuando la otra empieza (fin === inicio), NO se solapan.
export function seSolapan(a, b) {
  if (a.sala !== b.sala) return false
  return new Date(a.inicio) < new Date(b.fin) && new Date(b.inicio) < new Date(a.fin)
}

// ¿La fecha de inicio es futura respecto a "ahora"?
// OJO: recibimos "ahora" como parámetro (con un default) para poder probarla
// con una fecha fija — así el test no depende del reloj de la máquina.
export function esFechaFutura(inicioISO, ahora = new Date()) {
  return new Date(inicioISO) > ahora
}
