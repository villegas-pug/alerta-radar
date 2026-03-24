---
name: sync-prisma-refs
description: |
  Sincroniza referencias a modelos y campos Prisma en todo el codebase. Se activa cuando:
  - El usuario menciona renombrar, cambiar o actualizar modelos/campos de Prisma
  - El usuario menciona cambios en el schema.prisma o ejecuta `prisma generate`
  - El usuario pide actualizar archivos que usan modelos Prisma
  - Se detecta un cambio en los modelos de Prisma que necesita reflejarse en services, types, schemas o routes
  Usa esto siempre que el usuario quiera mantener sincronizados los archivos del proyecto con los modelos de la base de datos definidos en Prisma.
---

# Sync Prisma References

Este skill sincroniza los nombres de modelos y campos de Prisma en todos los archivos del proyecto. Cuando un modelo o campo cambia de nombre, busca y reemplaza todas las referencias en el codebase.

## Cómo funciona

### 1. Detectar el cambio

El cambio puede venir de dos fuentes:

**a) Del prompt del usuario:**
Si el usuario describe un cambio (ej: "renombré el campo `nombres` a `nombreCompleto` en Persona"), extrae:
- Modelo afectado: `Persona`
- Campo anterior: `nombres`
- Campo nuevo: `nombreCompleto`

**b) Del schema.prisma:**
1. Lee el `schema.prisma` actual en `prisma/schema.prisma`
2. Compara con el schema anterior (si existe un backup o el usuario lo indica)
3. Identifica modelos/campos agregados, eliminados o renombrados

### 2. Encontrar archivos a actualizar

Busca archivos que contengan referencias al modelo o campo afectado:

```bash
# Buscar en todo src/
grep -r "nombreCampoAnterior" src/
grep -r "NombreModelo" src/
```

Prioriza encontrar en:
- `**/*.service.ts` - Services que usan `prisma.{modelo}`
- `**/*.schema.ts` - Schemas Zod con tipos del modelo
- `**/*.types.ts` - Types/Interfaces TypeScript
- `**/route.ts` - Route handlers
- `**/index.ts` - Exports de features

### 3. Realizar el sync

Para cada archivo encontrado:

**Renombrar campo:**
```typescript
// Antes
campoAnterior: string;

// Después
campoNuevo: string;
```

**En consultas Prisma:**
```typescript
// Antes
prisma.persona.findMany({
  select: { nombres: true }
})

// Después  
prisma.persona.findMany({
  select: { nombreCompleto: true }
})
```

**En tipos/interface:**
```typescript
// Antes
interface Persona {
  nombres: string;
}

// Después
interface Persona {
  nombreCompleto: string;
}
```

**En schemas Zod:**
```typescript
// Antes
nombres: z.string(),

// Después
nombreCompleto: z.string(),
```

### 4. Reglas de nomenclatura

Sigue las convenciones del proyecto (AGENTS.md):

| Elemento | Convención |
|----------|------------|
| Modelos Prisma | PascalCase (`Persona`, `Tramite`) |
| Campos | camelCase (`nombreCompleto`, `idPersona`) |
| Tablas BD | PascalCase con prefijo `Sim` (`SimPersona`) |
| Enums | UPPER_SNAKE_CASE (`APROBADO`, `EN_PROCESO`) |

### 5. Archivos especiales

**index.ts de features:**
Actualiza los exports si cambiaste tipos:
```typescript
// Si el tipo cambió de nombre
export type { NuevoNombre } from './schemas/...';
```

**Schemas Zod:**
Actualiza los mensajes de error para que coincidan con el nuevo nombre:
```typescript
// Antes
nombres: z.string().min(1, "El campo nombres es requerido")

// Después
nombreCompleto: z.string().min(1, "El campo nombreCompleto es requerido")
```

### 6. Validación post-sync

Después de hacer los cambios:

1. **Verifica imports**: Asegúrate de que no haya imports faltantes
2. **Busca referencias olvidadas**: `grep` por el nombre antiguo
3. **Revisa TypeScript**: Si hay errores, corrígelos
4. **Confirma completitud**: No debe quedar ninguna referencia al nombre antiguo

## Ejemplo de flujo

**Prompt del usuario:**
"Renombré el campo `apellido1` a `primerApellido` y `apellido2` a `segundoApellido` en el modelo Persona"

**Acciones:**
1. Confirmar que el schema.prisma ya tiene los cambios
2. Buscar todas las referencias a `apellido1` y `apellido2` en src/
3. Reemplazar en:
   - `validate-excel.schema.ts`: campos en excelRowSchema
   - `validate-ingestion.schema.ts`: tipos relacionados
   - `process-ingestion.service.ts`: datos de personas
   - Cualquier otro archivo que los use
4. Verificar que no queden referencias antiguas

## Notas importantes

- **No modifica el schema.prisma** - Solo sincroniza referencias ya existentes
- **Siempre pide confirmación** antes de hacer cambios automáticos si son extensos
- **Haz backup mental** de lo que vas a cambiar para poder hacer rollback si es necesario
- **Si el cambio rompe algo**, notifica al usuario inmediatamente
