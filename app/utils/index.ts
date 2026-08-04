interface Institution {
  key: string
  label: string
  shortLabel: string
  icon: string
  resultUrl: string
}

export const institutions: Institution[] = [
  {
    key: 'mut',
    label: "Murang'a University",
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
  }
]