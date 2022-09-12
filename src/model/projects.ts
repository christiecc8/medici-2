export enum ProjectStatus {
  PROCESSING = 'processing',
  CREATED = 'ready',
  LAUNCHED = 'launched'
}

export type Project = {
  name: string,
  symbol: string,
  cover_cdn_url: string,
  cover_cdn_thumbnail_url: string,
  status: ProjectStatus,
}