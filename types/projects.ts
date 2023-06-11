export interface SingleProject {
  title: string
  certificatesystem: string
  address: string
  country: string
  status?: string
  id: string
}

export interface AllProjects {
  count: number
  projects: Array<SingleProject>
}
