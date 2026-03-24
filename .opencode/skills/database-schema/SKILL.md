---
name: database-schema
description: >
  Estructura exacta de la base de datos del **ARAM** — Alerta Radar de Alertas Migratorias. Consultar SIEMPRE antes de interactuar con la base de datos. Contiene nombres
  de tablas, columnas, tipos, PKs, FKs y reglas de negocio propias del sistema. 

  Cubre: SimAlertaMigratoria.
  No asumir ningún campo sin leer esto primero.
---

# DB Schema - ARAM Alerta Radar de Alertas Migratorias

> Fuente de verdad. Sincronizado con `schema.prisma`. No inferir estructura sin leer esto.

---

## Tablas y columnas

## Tablas

### `SimAlertaMigratoria`
> Tabla principal que almacena las alertas migratorias generadas a partir de los trámites procesados. Cada registro representa una alerta específica relacionada con un trámite migratorio.

| Campo | Tipo | Notas |
|---|---|---|
| `nIdAlerta` | `INTEGER` | PK Autoincremental |
| `sNumDocInvalida` | `VARCHAR(20)` | Número de documento inválido que generó la alerta |
| `sNombre` | `VARCHAR(100)` | Nombre de la persona relacionada con la alerta |
| `sPaterno` | `VARCHAR(100)` | Apellido paterno |
| `sMaterno` | `VARCHAR(100)` | Apellido materno |
| `sSexo` | `VARCHAR(10)` | Sexo de la persona |
| `sDocumento` | `VARCHAR(50)` | Tipo de documento (DNI, pasaporte, etc.) |
| `sNumDocIdentidad` | `VARCHAR(20)` | Número de documento de identidad |
| `dFechaNacimiento` | `DATE` | Fecha de nacimiento |
| `sPaisNacionalidad` | `VARCHAR(50)` | País de nacionalidad |
| `dFechaEmision` | `DATE` | Fecha de emisión del documento |
| `sMotivo` | `VARCHAR(255)` | Motivo de la alerta |
| `sTipoAlerta` | `VARCHAR(50)` | Tipo de alerta (ej: "Alerta por documento inválido") |
| `sObservaciones` | `TEXT` | Detalles adicionales sobre la alerta |
| `bEstado` | `BIT` | Estado actual de la alerta (ej: 0, 1) |
| `bFallecido` | `BIT` | Indica si la persona está fallecida (ej: 0, 1) |
| `dFechaRegistro` | `DATETIME` | Fecha y hora en que se registró la alerta |
---
 
## Relaciones
```
```
