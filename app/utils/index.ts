export interface Institution {
  /** Route key */
  key: string

  /** Full institution name */
  label: string

  /** Abbreviated name */
  shortLabel: string

  /** Lucide icon */
  icon: string

  /** Academic results portal */
  resultUrl: string
}

export const institutions: Institution[] = [
  {
    key: 'mut',
    label: "Murang'a University of Technology",
    shortLabel: 'MUT',
    icon: 'i-lucide-graduation-cap',
    resultUrl: 'https://portal.mut.ac.ke/Academic/ReportsQR'
  },
  {
    key: 'jkuat',
    label: 'Jomo Kenyatta University of Agriculture and Technology',
    shortLabel: 'JKUAT',
    icon: 'i-lucide-flask-conical',
    resultUrl: 'https://portal.jkuat.ac.ke/Academic/ReportsQR'
  },
  {
    key: 'kmtc',
    label: 'Kenya Medical Training College',
    shortLabel: 'KMTC',
    icon: 'i-lucide-stethoscope',
    resultUrl: 'https://portal.kmtc.ac.ke/Academic/ReportsQR'
  },
  {
    key: 'mksu',
    label: 'Machakos University',
    shortLabel: 'MKSU',
    icon: 'i-lucide-book-open',
    resultUrl: 'https://portal.mksu.ac.ke/Academic/ReportsQR'
  }
] as const