// server.js — el ÚNICO que enciende el servidor (listen).
// Las pruebas NO importan este archivo; importan app.js.
import { app } from './app.js'

const PORT = process.env.PORT || 3010
app.listen(PORT, () => {
  console.log(`Reserva de labs escuchando en http://localhost:${PORT}`)
})
