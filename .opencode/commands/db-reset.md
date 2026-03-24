---
description: Resetea la base de datos y regenera el cliente Prisma desde cero
---

Ejecuta en orden los siguientes comandos y detente si alguno falla:

!`rm -rf .next`
!`rm -f prisma/dev.db`
!`pnpm prisma migrate reset --force`
!`pnpm prisma migrate dev --name init`
!`pnpm prisma generate`
!`pnpm tsc --noEmit`

Reporta el resultado de cada paso y notifícame si hay errores.