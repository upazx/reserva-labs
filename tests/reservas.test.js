// reservas.test.js — pruebas de INTEGRACIÓN (el medio de la pirámide).
// Prueban el ENDPOINT completo: ruta + validación + reglas + respuesta, por su frontera HTTP.
// Usan supertest para pegarle al app sin abrir el navegador.
import { test } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'

test('GET /reservas devuelve 200 y una lista', async () => {
  const res = await request(app).get('/reservas')
  assert.strictEqual(res.status, 200)
  assert.ok(Array.isArray(res.body))
})

test('POST /reservas crea y responde 201', async () => {
  const nueva = { sala: 'Lab 5', inicio: '2030-11-01T08:00', fin: '2030-11-01T10:00' }
  const res = await request(app).post('/reservas').send(nueva)
  assert.strictEqual(res.status, 201)
  assert.strictEqual(res.body.sala, 'Lab 5')
  assert.ok(res.body.id)
})

test('POST /reservas con fin antes de inicio → 400', async () => {
  const mala = { sala: 'Lab 5', inicio: '2030-11-01T10:00', fin: '2030-11-01T08:00' }
  const res = await request(app).post('/reservas').send(mala)
  assert.strictEqual(res.status, 400)
  assert.ok(res.body.error)
})

test('POST /reservas que se pisa con otra en la misma sala → 409', async () => {
  // Choca con la reserva semilla (Lab 1, 08:00–10:00)
  const choca = { sala: 'Lab 1', inicio: '2030-10-01T09:00', fin: '2030-10-01T11:00' }
  const res = await request(app).post('/reservas').send(choca)
  assert.strictEqual(res.status, 409)
  assert.ok(res.body.error)
})
