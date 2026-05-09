// lib/race-entities.ts
import { COUNTRIES, type Country } from "./data/countries";
import { TRIBES, type Tribe } from "./data/tribes";

export type RaceEntity = Country | Tribe;
export type RaceMode = "countries" | "tribes";

// غيّر هذا المتغير يدوياً للتبديل بين الدول والقبائل 
// اذا تبي تحط دول ولا قبايل حط countries  او tribes
export const CURRENT_RACE_MODE: RaceMode = "tribes"; // أو "tribes"

export function getActiveEntities(): RaceEntity[] {
  return CURRENT_RACE_MODE === "countries" ? COUNTRIES : TRIBES;
}

export function findEntityInComment(text: string): RaceEntity | null {
  const normalized = text.toLowerCase().trim();
  const entities = getActiveEntities();
  
  const candidates: Array<{ entity: RaceEntity; alias: string }> = [];
  for (const entity of entities) {
    // الأسماء المستعارة
    const aliases = "aliases" in entity ? entity.aliases : [];
    for (const alias of aliases) {
      candidates.push({ entity, alias: alias.toLowerCase() });
    }
    // الاسم نفسه
    candidates.push({ entity, alias: entity.name.toLowerCase() });
    // الكود (رقم القبيلة مثلاً)
    if (entity.code) {
      candidates.push({ entity, alias: entity.code.toLowerCase() });
    }
  }
  
  candidates.sort((a, b) => b.alias.length - a.alias.length);
  for (const cand of candidates) {
    if (normalized.includes(cand.alias)) return cand.entity;
  }
  return null;
}

export function getEntityColor(entity: RaceEntity): string {
  return entity.color;
}

export function getEntityCode(entity: RaceEntity): string {
  return entity.code;
}