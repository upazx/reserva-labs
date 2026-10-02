// reglas.test.js — pruebas UNITARIAS (la base de la pirámide).
// Prueban UNA función aislada, sin levantar el servidor ni hablar HTTP.
// Rapidísimas: por eso conviene tener muchas.
import { test } from 'node:test'
import assert from 'node:assert'
import { seSolapan, esFechaFutura } from '../src/reglas.js'

test('seSolapan: dos reservas de la misma sala que se pisan → true', () => {
  const a = { sala: 'Lab 1', inicio: '2030-10-01T08:00', fin: '2030-10-01T10:00' }
  const b = { sala: 'Lab 1', inicio: '2030-10-01T09:00', fin: '2030-10-01T11:00' }
  assert.strictEqual(seSolapan(a, b), true)
})

test('seSolapan: distinta sala → false (aunque sea el mismo horario)', () => {
  const a = { sala: 'Lab 1', inicio: '2030-10-01T08:00', fin: '2030-10-01T10:00' }
  const b = { sala: 'Lab 2', inicio: '2030-10-01T08:00', fin: '2030-10-01T10:00' }
  assert.strictEqual(seSolapan(a, b), false)
})

test('seSolapan: una termina justo cuando la otra empieza → false (borde)', () => {
  const a = { sala: 'Lab 1', inicio: '2030-10-01T08:00', fin: '2030-10-01T10:00' }
  const b = { sala: 'Lab 1', inicio: '2030-10-01T10:00', fin: '2030-10-01T12:00' }
  assert.strictEqual(seSolapan(a, b), false)
})

test('esFechaFutura: con un "ahora" fijo, una fecha posterior → true', () => {
  const ahora = new Date('2030-01-01T00:00')
  assert.strictEqual(esFechaFutura('2030-10-01T08:00', ahora), true)
})

test('esFechaFutura: una fecha anterior al "ahora" → false', () => {
  const ahora = new Date('2030-01-01T00:00')
  assert.strictEqual(esFechaFutura('2020-01-01T08:00', ahora), false)
})
