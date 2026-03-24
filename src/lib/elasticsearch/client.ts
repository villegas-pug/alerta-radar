import { Client } from "@elastic/elasticsearch";

const globalForElastic = globalThis as unknown as {
  elastic: Client | undefined;
};

export const elasticClient = globalForElastic.elastic ?? 
  new Client({
    node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  });

if (process.env.NODE_ENV !== "production") globalForElastic.elastic = elasticClient;

export const ALERTS_INDEX = "alertas-migratorias";

export const ALERT_INDEX_MAPPING = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    analysis: {
      analyzer: {
        default: {
          type: "standard",
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: "keyword" },
      nombre: { type: "text", analyzer: "standard" },
      pasaporte: { type: "keyword" },
      nacionalidad: { type: "text", analyzer: "standard" },
      tipoAlerta: { type: "keyword" },
      descripcion: { type: "text", analyzer: "standard" },
      fechaAlerta: { type: "date" },
      fechaCreacion: { type: "date" },
      estatus: { type: "keyword" },
    },
  },
};
