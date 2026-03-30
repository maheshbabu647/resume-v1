export interface ResumeListItem {
  _id: string
  title: string
  templateId: string
  status: string
  updatedAt: Date
  personalInfo?: any
  sections?: any[]
}

export interface PaginatedResumes {
  resumes: ResumeListItem[]
  total: number
  page: number
  limit: number
}
