export interface Country {
  /** ISO 3166-1 alpha-2 (lowercase, used by flagcdn) */
  code: string
  /** Arabic display name */
  name: string
  /** Possible names users may type in comments (lowercased before matching) */
  aliases: string[]
  /** Accent color used for the lane / progress bar */
  color: string
}

export const COUNTRIES: Country[] = [
  {
    code: "eg",
    name: "مصر",
    aliases: ["مصر", "مصرى", "مصري", "egypt"],
    color: "#CE1126",
  },
  {
    code: "sa",
    name: "السعودية",
    aliases: ["السعودية", "السعوديه", "سعودية", "سعوديه", "السعودي", "saudi"],
    color: "#006C35",
  },
  {
    code: "ae",
    name: "الإمارات",
    aliases: ["الإمارات", "الامارات", "امارات", "uae", "emirates"],
    color: "#00732F",
  },
  {
    code: "iq",
    name: "العراق",
    aliases: ["العراق", "عراق", "iraq"],
    color: "#CE1126",
  },
  {
    code: "jo",
    name: "الأردن",
    aliases: ["الأردن", "الاردن", "اردن", "jordan"],
    color: "#000000",
  },
  {
    code: "lb",
    name: "لبنان",
    aliases: ["لبنان", "lebanon"],
    color: "#ED1C24",
  },
  {
    code: "ps",
    name: "فلسطين",
    aliases: ["فلسطين", "palestine"],
    color: "#009639",
  },
  {
    code: "kw",
    name: "الكويت",
    aliases: ["الكويت", "كويت", "kuwait"],
    color: "#007A3D",
  },
  {
    code: "qa",
    name: "قطر",
    aliases: ["قطر", "qatar"],
    color: "#8D1B3D",
  },
  {
    code: "bh",
    name: "البحرين",
    aliases: ["البحرين", "بحرين", "bahrain"],
    color: "#CE1126",
  },
  {
    code: "om",
    name: "عمان",
    aliases: ["عمان", "عُمان", "سلطنة عمان", "oman"],
    color: "#DC241F",
  },
  {
    code: "ye",
    name: "اليمن",
    aliases: ["اليمن", "يمن", "yemen"],
    color: "#CE1126",
  },
  {
    code: "sy",
    name: "سوريا",
    aliases: ["سوريا", "سورية", "syria"],
    color: "#CE1126",
  },
  {
    code: "ly",
    name: "ليبيا",
    aliases: ["ليبيا", "libya"],
    color: "#239E46",
  },
  {
    code: "tn",
    name: "تونس",
    aliases: ["تونس", "tunisia"],
    color: "#E70013",
  },
  {
    code: "dz",
    name: "الجزائر",
    aliases: ["الجزائر", "جزائر", "algeria"],
    color: "#006233",
  },
  {
    code: "ma",
    name: "المغرب",
    aliases: ["المغرب", "مغرب", "morocco"],
    color: "#C1272D",
  },
  {
    code: "mr",
    name: "موريتانيا",
    aliases: ["موريتانيا", "mauritania"],
    color: "#006233",
  },
  {
    code: "sd",
    name: "السودان",
    aliases: ["السودان", "سودان", "sudan"],
    color: "#D21034",
  },
  {
    code: "so",
    name: "الصومال",
    aliases: ["الصومال", "صومال", "somalia"],
    color: "#4189DD",
  },
  {
    code: "dj",
    name: "جيبوتي",
    aliases: ["جيبوتي", "djibouti"],
    color: "#6AB2E7",
  },
  {
    code: "km",
    name: "جزر القمر",
    aliases: ["جزر القمر", "القمر", "comoros"],
    color: "#3B7728",
  },
]

/**
 * Try to find a country whose alias appears in the given comment text.
 * Returns the country code or null.
 */
export function findCountryInComment(text: string): string | null {
  if (!text) return null
  const normalized = text.toLowerCase().trim()
  // longer aliases first so "السعودية" matches before "سعودي"
  const candidates: Array<{ code: string; alias: string }> = []
  for (const c of COUNTRIES) {
    for (const a of c.aliases) {
      candidates.push({ code: c.code, alias: a.toLowerCase() })
    }
  }
  candidates.sort((a, b) => b.alias.length - a.alias.length)
  for (const cand of candidates) {
    if (normalized.includes(cand.alias)) return cand.code
  }
  return null
}
