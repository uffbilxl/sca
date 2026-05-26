export type OpportunityType = 'INTERNSHIP' | 'PLACEMENT' | 'GRADUATE' | 'SPRING_WEEK' | 'INSIGHT'
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE'
export type Status = 'OPEN' | 'CLOSING_SOON' | 'CLOSED'
export type EventType = 'WORKSHOP' | 'PANEL' | 'HACKATHON' | 'NETWORKING' | 'TALK' | 'OTHER'

export interface Company {
  id: string
  name: string
  slug: string
  logo: string | null
  website: string | null
  description: string | null
}

export interface Tag {
  id: string
  name: string
}

export interface Opportunity {
  id: string
  title: string
  slug: string
  description: string
  requirements: string | null
  responsibilities: string | null
  type: OpportunityType
  location: string
  workMode: WorkMode
  salary: string | null
  salaryMin: number | null
  salaryMax: number | null
  deadline: Date | null
  startDate: string | null
  duration: string | null
  sponsored: boolean
  featured: boolean
  status: Status
  applyUrl: string | null
  company: Company
  tags: { tag: Tag }[]
  _count?: { comments: number }
  createdAt: Date
}

export interface Comment {
  id: string
  body: string
  authorName: string | null
  anonymous: boolean
  approved: boolean
  pinned: boolean
  createdAt: Date
}

export interface SCAEvent {
  id: string
  title: string
  description: string | null
  location: string
  isOnline: boolean
  date: Date
  endDate: Date | null
  spots: number | null
  registrations: number
  registrationUrl: string | null
  type: EventType
}

export interface FilterState {
  types: OpportunityType[]
  workModes: WorkMode[]
  sponsored: boolean | null
  salaryMin: number
  search: string
  sort: 'newest' | 'deadline' | 'salary' | 'az'
}
