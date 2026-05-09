// lib/types.ts
import type { RaceEntity } from "./race-entities"

export type HorseState = "idle" | "comment" | "boost"

export interface HorseData extends RaceEntity {
  points: number           // النقاط المستهلكة فعلياً (التي تحدد موضع الحصان)
  pendingPoints: number    // النقاط المتراكمة التي لم تستهلك بعد
  state: HorseState
  finishPosition: number | null
  finishedAt: number | null
}

export interface Standing {
  code: string
  name: string
  gold: number
  silver: number
  bronze: number
  total: number
}

export interface CommentMessage {
  type: "comment"
  comment: string
  userId: string
  nickname?: string
}

export interface GiftMessage {
  type: "gift"
  giftName: string
  diamonds: number
  repeat: number
  userId: string
  nickname?: string
}

export type IncomingMessage = CommentMessage | GiftMessage