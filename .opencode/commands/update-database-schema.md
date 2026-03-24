---
description: Sincroniza el SKILL database-schema con los nuevos modelos definidos en schema.prisma
---

Lee `schema.prisma` y `.opencode/skills/database-schema/SKILL.md`.

Compara los modelos de `schema.prisma` contra las tablas documentadas en el SKILL.
Si no hay modelos nuevos, notifícame y detente.

Por cada modelo nuevo genera su sección respetando estas convenciones:

**Nombre de tabla:** prefijo `Sim` + nombre del modelo en PascalCase

**Campos:** aplicar notación húngara según convenciones definidas en `AGENTS.md`

**Estructura de tabla:** seguir exactamente el formato de las tablas existentes en el SKILL.

**Relaciones:** infiere las relaciones directamente desde las FKs definidas en `schema.prisma`
y agrégalas en `## Relaciones` siguiendo el formato existente:
```
TablaOrigen (1) ──< TablaDestino (N)
```

**Reglas estrictas:**
- Solo agregar, nunca modificar ni eliminar entradas existentes
- No tocar el frontmatter del SKILL
- No reescribir tablas ya documentadas bajo ninguna circunstancia

Muéstrame el bloque markdown generado y espera mi confirmación antes de escribir los cambios.