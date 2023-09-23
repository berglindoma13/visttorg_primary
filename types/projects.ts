import { User } from "./auth"

export interface Project {
  title: string
  certificatesystem: string
  address: string
  country: string
  status?: number | string
  id: string | number
  ownerEmail: string
  owner?: ProjectOwner
}

export interface ProjectOwner extends User {
  projects: Array<Project>
}

export interface ProductsInProjects {
  productId: string
  project: Project
  projectId: string | number
}