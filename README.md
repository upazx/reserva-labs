# Starter CI · Reserva de labs

Backend mínimo de **Reserva de labs** para la **Clase 18** (Programación Web · URL): cierra el ciclo
de pruebas con **Integración Continua**.

Tiene las dos capas de la pirámide + el robot que las corre sola:

- **Pruebas unitarias** (`tests/reglas.test.js`) — prueban funciones puras de `src/reglas.js`
  (`seSolapan`, `esFechaFutura`) sin levantar el servidor.
- **Pruebas de integración** (`tests/reservas.test.js`) — prueban los endpoints con **supertest**
  (200 / 201 / 400 / 409).
- **CI** (`.github/workflows/ci.yml`) — GitHub Actions corre `npm test` en cada `push` y cada PR.
- **Candado local** (`.husky/pre-push`) — antes de cada `git push` corre `npm test`; si hay rojo,
  **aborta el push** (con husky).

## Correr local

> ⚠️ Trabajá **fuera de OneDrive** (ej. `C:\dev\reserva-labs`). `npm install` activa husky, que
> configura los hooks de Git en este repo — no lo corras dentro de otro repo que no sea el tuyo.

```bash
git init            # primero el repo
npm install         # instala deps y activa husky (hooks)
npm test            # node --test → corre unitarias + integración (9 en verde)
```

## Las dos capas que frenan el código rojo

1. **Candado local (pre-push hook).** Ya viene en `.husky/pre-push`. Después de `npm install`,
   cada `git push` corre `npm test`; si falla, el push **no sale de tu máquina**. (Se puede saltar
   con `git push --no-verify` — por eso existe la capa 2.)
2. **Candado del equipo (branch protection).** En GitHub → *Settings › Branches › Add rule* sobre
   `main`: activá **Require a pull request before merging** y **Require status checks to pass** →
   elegí el check `test`. Así un PR con el CI en rojo **no se puede mergear**, y nadie empuja
   directo a `main`.

## Probar que funciona

1. Subí el repo a GitHub (`git push`) → pestaña **Actions** → ✓ verde.
2. Rompé una regla en `src/reglas.js` (un `<` por un `>` en `seSolapan`), `commit` y `git push`.
3. El **hook local** aborta el push (`husky - pre-push script failed`). Si lo forzás con
   `--no-verify`, el **CI** lo pone rojo y la **branch protection** bloquea el merge a `main`.
4. Arreglá la regla → verde local → el push pasa → CI verde → el PR se puede mergear.

> Las pruebas corren contra **datos en memoria**, no contra una base real — por eso andan igual
> en la nube sin credenciales.
