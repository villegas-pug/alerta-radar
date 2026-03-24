export interface KpiStats {
  totalAlerts: number
  activeAlerts: number
  uploadsCount: number
  searchesCount: number
}

export interface AlertByType {
  tipo: string
  count: number
}

export interface NationalityData {
  nacionalidad: string
  count: number
}

export interface AgeGroupData {
  grupo: string
  count: number
}

export interface GenderData {
  genero: string
  count: number
}

export interface TimelineData {
  mes: string
  count: number
}

export interface AuthorityData {
  autoridad: string
  count: number
}

export interface AnalyticsStats {
  kpis: KpiStats
  alertsByType: AlertByType[]
  topNationalities: NationalityData[]
  ageGroups: AgeGroupData[]
  genderDistribution: GenderData[]
  timeline: TimelineData[]
  byAuthority: AuthorityData[]
}
