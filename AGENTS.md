## PROYECTO

**ARAM** — Alerta Radar de Alertas Migratorias
ARAM es una plataforma digital privada diseñada para la gestión, almacenamiento y búsqueda inteligente de alertas migratorias. Permite a los operadores cargar masivamente registros estructurados desde archivos CSV o Excel, almacenarlos de forma segura y consultarlos en tiempo real mediante un motor de búsqueda indexada de alto rendimiento.

## PROPÓSITO DEL SISTEMA
ARAM centraliza información de alertas migratorias en un único sistema accesible, eliminando la revisión manual de grandes volúmenes de datos. Su motor de búsqueda 
permite localizar cualquier alerta de forma inmediata, precisa y eficiente.

## STACK
Next.js 15 · Multer + SheetJS · SQLite + Prisma · Elasticsearch · pnpm

## LIBRERÍAS
| Propósito | Librería |
|---|---|
| Estilos | Tailwind |
| Componentes UI | shadcn/ui |
| Validación | Zod |
| Autenticación | NextAuth |
| Estado global y contexto | zustand |
| Manejo de formularios | React Hook Form |
| Cliente http | Axios |

---

## ARQUITECTURA
Modular basada en features. Pages y Route Handlers son delegadores puros.

```
src/
├── app/
│   ├── api/[feature]/route.ts
│   └── [feature]/page.tsx
├── features/[feature]/
│   ├── components/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── index.ts
├── components/
├── lib/
│   └── prisma/client.ts
└── types/
prisma/schema.prisma
```

Si considaras necesario, puedes agregar otros directorios y archivos, la idea es mantener la mayoría del código organizado por feature para facilitar el mantenimiento y la escalabilidad.

---

## FEATURES DEL SISTEMA

### Feature 1: alerts-upload
Responsable de todo el flujo de carga masiva de alertas migratorias 
desde archivos CSV/Excel.

### Feature 2: alerts-search  
Responsable de la búsqueda indexada de alertas con soporte multi-campo, 
fuzzy search y ranking por relevancia.

Campos (multi_match):
- nombre       | text    | ^3
- pasaporte    | keyword | ^3
- nacionalidad | text    | ^2
- tipo_alerta  | keyword | ^2
- descripcion  | text    | ^1

**Config:** fuzziness AUTO · operador OR · 20 resultados por página

### Feature 3: alerts-storage
Responsable de la gestión y trazabilidad de los registros almacenados.

## CONVENCIONES
**Carpetas:** kebab-case  
**Archivos:** `[verbo]-[entidad].service.ts` · `[verbo]-[entidad].schema.ts` · `[entidad]-[rol].tsx` · `use-[entidad].ts` · `[entidad].types.ts`.  
**TS:** PascalCase tipos · camelCase funciones/variables · UPPER_SNAKE_CASE constantes.
**Exports:** named siempre · default solo en `page.tsx` / `layout.tsx`.
**Next.js Loading:** usar `loading.tsx + Suspense + useFormStatus`.
**Imports:** alias `@/` siempre · sin relativos que suban más de un nivel.
**Prisma:** Modelo siempre `PascalCase` · Campo siempre `camelCase` · Enums siempre `UPPER_CASE`.

**Database:** Tabla siempre `Sim+PascalCase` · Campo siempre `prefijo+PascalCase` notación húngara con prefijo según tipo:

| Prefijo | Tipo SQL |
|---|---|
| `u` | UNIQUEIDENTIFIER |
| `s` | STRING / VARCHAR |
| `n` | INT / DECIMAL |
| `d` | DATETIME |
| `b` | BIT / BOOLEAN |
| `x` | IMAGE / VARBINARY |

---

## PATRONES
**Route Handler flow**  
`app/api/[feature]/route.ts` → validar con Zod → llamar servicio → `NextResponse.json`  
Sin Server Actions.

**Services**  
Un archivo = una función = una responsabilidad. Único lugar que importa `prisma`. Retorno siempre tipado.

**Result type**  
`ActionResult<T>` global: `{ ok: true; data: T } | { ok: false; error: string }`