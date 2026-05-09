"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  getActiveEntities,
  findEntityInComment,
} from "@/lib/race-entities"
import {
  COMMENT_POINTS,
  GIFT_POINTS_PER_DIAMOND,
  TARGET_POINTS,
  WINNER_DISPLAY_MS,
  BASE_CONSUMPTION_RATE,
  SCALE_CONSUMPTION_RATE,
  MAX_COMMENT_RATE,
  CONSUMPTION_RATE_BOOST,
} from "@/lib/constants"
import type { HorseData, IncomingMessage, Standing, HorseState } from "@/lib/types"

interface PendingGift {
  diamonds: number
  timestamp: number
}

function createInitialHorses(): HorseData[] {
  const entities = getActiveEntities()
  return entities.map((entity) => ({
    ...entity,
    points: 0,
    pendingPoints: 0,
    state: "idle",
    finishPosition: null,
    finishedAt: null,
  }))
}

function createInitialStandings(): Standing[] {
  const entities = getActiveEntities()
  return entities.map((entity) => ({
    code: entity.code,
    name: entity.name,
    gold: 0,
    silver: 0,
    bronze: 0,
    total: 0,
  }))
}

// دالة حساب معدل الاستهلاك حسب الحالة والنقاط المتراكمة
function getConsumptionRate(state: HorseState, pendingPoints: number): number {
  if (state === "boost") return CONSUMPTION_RATE_BOOST
  if (state === "comment") {
    let rate = BASE_CONSUMPTION_RATE + pendingPoints * SCALE_CONSUMPTION_RATE
    return Math.min(rate, MAX_COMMENT_RATE)
  }
  return 0
}

export function useRaceEngine() {
  const [horses, setHorses] = useState<HorseData[]>(() => createInitialHorses())
  const [standings, setStandings] = useState<Standing[]>(() => createInitialStandings())
  const [winners, setWinners] = useState<HorseData[] | null>(null)
  const [roundNumber, setRoundNumber] = useState(1)

  const pendingGiftsRef = useRef<Map<string, PendingGift[]>>(new Map())
  const GIFT_EXPIRY_MS = 120_000

  // استهلاك النقاط التدريجي باستخدام requestAnimationFrame
  useEffect(() => {
    let lastTimestamp = performance.now()
    let animationId: number

    const consumePoints = (now: number) => {
      const deltaSeconds = Math.min(0.1, (now - lastTimestamp) / 1000)
      lastTimestamp = now

      setHorses((prev) => {
        let changed = false
        const updated = prev.map((horse) => {
          if (horse.finishPosition !== null) return horse
          if (horse.points >= TARGET_POINTS) return horse

          const rate = getConsumptionRate(horse.state, horse.pendingPoints)
          if (rate === 0 || horse.pendingPoints <= 0) {
            if (horse.state !== "idle") {
              changed = true
              return { ...horse, state: "idle" }
            }
            return horse
          }

          const consume = Math.min(horse.pendingPoints, rate * deltaSeconds)
          if (consume <= 0) return horse

          let newPoints = horse.points + consume
          let newPending = horse.pendingPoints - consume
          let newState = horse.state

          if (newPoints >= TARGET_POINTS) {
            newPoints = TARGET_POINTS
            newPending = 0
          }
          if (newPending <= 0 && newState !== "idle") {
            newState = "idle"
          }

          if (newPoints !== horse.points || newPending !== horse.pendingPoints || newState !== horse.state) {
            changed = true
            return { ...horse, points: newPoints, pendingPoints: newPending, state: newState }
          }
          return horse
        })
        return changed ? updated : prev
      })

      animationId = requestAnimationFrame(consumePoints)
    }

    animationId = requestAnimationFrame(consumePoints)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // تنظيف الهدايا المنتهية
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      let changed = false
      for (const [userId, gifts] of pendingGiftsRef.current.entries()) {
        const activeGifts = gifts.filter(g => now - g.timestamp < GIFT_EXPIRY_MS)
        if (activeGifts.length !== gifts.length) {
          pendingGiftsRef.current.set(userId, activeGifts)
          changed = true
        }
      }
      if (changed) setHorses(prev => [...prev])
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleComment = useCallback((msg: { comment: string; userId: string }) => {
    const entity = findEntityInComment(msg.comment)
    if (!entity) return

    const userPending = pendingGiftsRef.current.get(msg.userId) || []
    let totalDiamonds = 0
    if (userPending.length > 0) {
      totalDiamonds = userPending.reduce((sum, g) => sum + g.diamonds, 0)
      pendingGiftsRef.current.delete(msg.userId)
    }

    setHorses((prev) =>
      prev.map((horse) => {
        if (horse.code !== entity.code || horse.finishPosition !== null) return horse

        let pointsGain = COMMENT_POINTS
        let newState: 'idle' | 'comment' | 'boost' = 'comment'

        if (totalDiamonds > 0) {
          pointsGain += totalDiamonds * GIFT_POINTS_PER_DIAMOND
          newState = 'boost'
        }

        return {
          ...horse,
          pendingPoints: horse.pendingPoints + pointsGain,
          state: newState,
        }
      }),
    )
  }, [])

  const handleGift = useCallback((msg: { giftName: string; diamonds: number; repeat: number; userId: string }) => {
    const totalDiamonds = (msg.diamonds || 0) * (msg.repeat || 1)
    if (totalDiamonds <= 0) return

    const now = Date.now()
    const currentGifts = pendingGiftsRef.current.get(msg.userId) || []
    const updatedGifts = [...currentGifts, { diamonds: totalDiamonds, timestamp: now }]
    const validGifts = updatedGifts.filter(g => now - g.timestamp < GIFT_EXPIRY_MS)
    pendingGiftsRef.current.set(msg.userId, validGifts)
  }, [])

  const handleMessage = useCallback(
    (msg: IncomingMessage) => {
      if (msg.type === "comment") handleComment(msg)
      else if (msg.type === "gift") handleGift(msg)
    },
    [handleComment, handleGift],
  )

  // كشف الفائزين (عند وصول النقاط المستهلكة إلى TARGET_POINTS)
  const finishedRef = useRef<string[]>([])
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setHorses((prev) => {
        let changed = false
        const updated = prev.map((horse) => {
          if (horse.finishPosition !== null) return horse
          if (horse.points >= TARGET_POINTS && !finishedRef.current.includes(horse.code)) {
            if (finishedRef.current.length < 3) {
              finishedRef.current.push(horse.code)
              changed = true
              return {
                ...horse,
                finishPosition: finishedRef.current.length,
                finishedAt: now,
                state: "idle",
                pendingPoints: 0,
              }
            }
          }
          return horse
        })
        return changed ? updated : prev
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // عرض الفائزين وإعادة ضبط الجولة
  useEffect(() => {
    if (winners) return
    const finishedHorses = horses
      .filter((h) => h.finishPosition !== null)
      .sort((a, b) => (a.finishPosition ?? 0) - (b.finishPosition ?? 0))
    if (finishedHorses.length < 3) return

    const top3 = finishedHorses.slice(0, 3)
    setWinners(top3)

    setStandings((prev) => {
      const map = new Map(prev.map((s) => [s.code, { ...s }]))
      top3.forEach((winner, idx) => {
        const entry = map.get(winner.code) ?? {
          code: winner.code,
          name: winner.name,
          gold: 0,
          silver: 0,
          bronze: 0,
          total: 0,
        }
        if (idx === 0) entry.gold += 1
        else if (idx === 1) entry.silver += 1
        else entry.bronze += 1
        entry.total = entry.gold * 3 + entry.silver * 2 + entry.bronze * 1
        map.set(winner.code, entry)
      })
      return Array.from(map.values()).sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total
        if (b.gold !== a.gold) return b.gold - a.gold
        if (b.silver !== a.silver) return b.silver - a.silver
        return b.bronze - a.bronze
      })
    })

    const timer = setTimeout(() => {
      finishedRef.current = []
      pendingGiftsRef.current.clear()
      setHorses(createInitialHorses())
      setWinners(null)
      setRoundNumber((n) => n + 1)
    }, WINNER_DISPLAY_MS)

    return () => clearTimeout(timer)
  }, [horses, winners])

  return {
    horses,
    standings,
    winners,
    roundNumber,
    handleMessage,
  }
}