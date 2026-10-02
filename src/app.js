// app.js — crea y configura el servidor Express, pero NO lo enciende.
// Se EXPORTA para que las pruebas lo usen sin ocupar un puerto.
// El listen() vive aparte, en server.js.
import express from 'express'
import { z } from 'zod'
import { seSolapan, esFechaFutura } from './reglas.js'

export const app = express()
app.use(express.json())

// "Base de datos" en memoria — a propósito NO tocamos Supabase en las pruebas.
const reservas = [
  { id: 1, sala: 'Lab 1', inicio: '2030-10-01T08:00', fin: '2030-10-01T10:00' },
]
let siguienteId = 2

const reservaSchema = z
  .object({
    sala: z.string().min(1, 'la sala es obligatoria'),
    inicio: z.string().min(1, 'inicio es obligatorio'),
    fin: z.string().min(1, 'fin es obligatorio'),
  })
  .refine((d) => new Date(d.fin) > new Date(d.inicio), {
    message: 'el fin debe ser posterior al inicio',
    path: ['fin'],
  })

app.get('/reservas', (req, res) => {
  res.status(200).json(reservas)
})

app.post('/reservas', (req, res) => {
  const r = reservaSchema.safeParse(req.body)
  if (!r.success) {
    return res.status(400).json({ error: r.error.flatten().fieldErrors })
  }
  // Las reglas PURAS (probadas por unidad) se usan acá dentro:
  if (!esFechaFutura(r.data.inicio)) {
    return res.status(400).json({ error: 'no se puede reservar en el pasado' })
  }
  if (reservas.some((x) => seSolapan(x, r.data))) {
    return res.status(409).json({ error: 'esa sala ya está reservada en ese horario' })
  }
  const nueva = { id: siguienteId++, ...r.data }
  reservas.push(nueva)
  res.status(201).json(nueva)
})
