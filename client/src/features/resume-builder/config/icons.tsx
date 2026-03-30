import React from 'react'
import {
  User, FileText, Briefcase, BookOpen, Code2, Star, Award, Globe, Users, Medal,
  Shield, HeartPulse, GraduationCap, Banknote, Calendar, ClipboardList
} from 'lucide-react'
import type { SectionKey } from '../templates/shared/template.types'

export const ICON_MAP: Partial<Record<SectionKey | 'personalInfo' | 'summary', React.ReactNode>> = {
  personalInfo: <User size={16} />,
  summary: <FileText size={16} />,
  experience: <Briefcase size={16} />,
  education: <BookOpen size={16} />,
  projects: <Star size={16} />,
  skills: <Code2 size={16} />,
  certifications: <Award size={16} />,
  languages: <Globe size={16} />,
  volunteering: <Users size={16} />,
  awards: <Medal size={16} />,
  publications: <BookOpen size={16} />,
  presentations: <Users size={16} />,
  licensure: <Award size={16} />,
  barAdmissions: <Shield size={16} />,
  custom: <ClipboardList size={16} />,
  memberships: <Users size={16} />,
  clinicalExperience: <HeartPulse size={16} />,
  grants: <Banknote size={16} />,
  teachingExperience: <GraduationCap size={16} />,
  securityClearance: <Shield size={16} />,
  events: <Calendar size={16} />,
  internships: <Briefcase size={16} />,
}
