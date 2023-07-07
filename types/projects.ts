import { User } from "./auth"

export interface Project {
  title: string
  certificatesystem: string
  address: string
  country: string
  status?: number
  id: string
  ownerEmail: string
  owner: ProjectOwner
}

export interface ProjectOwner extends User {
  projects: Array<Project>
}   