"use client"

import { useEffect, useState } from "react"
import { ClassicoPanel } from "@/components/classico-panel"
import { CurrentRankings } from "@/components/current-rankings"
import { DevPanel } from "@/components/dev-panel"
import { RaceTrack } from "@/components/race-track"
import { WinnerModal } from "@/components/winner-modal"
import { useRaceEngine } from "@/hooks/use-race-engine"
import { useWebSocket } from "@/hooks/use-websocket"
import { STAGE_HEIGHT, STAGE_WIDTH, WS_URL } from "@/lib/constants"

const HEADER_H = 70
const SIDE_W = 300

export default function Page() {
  const { horses, standings, winners, roundNumber, handleMessage } = useRaceEngine()
  const { connected } = useWebSocket(WS_URL, handleMessage)
  const [showDev, setShowDev] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.has("nodev")) setShowDev(false)
  }, [])

  return (
    <main
      className="relative mx-auto select-none overflow-hidden text-amber-50"
      dir="rtl"
      style={{
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        background:
          "radial-gradient(ellipse at 50% 0%, #44260f 0%, #1a0e05 70%, #000 100%)",
        boxShadow: "0 0 80px rgba(0,0,0,0.8)",
      }}
    >
      {/* Top: Classico panel */}
      <ClassicoPanel
        standings={standings}
        roundNumber={roundNumber}
        connected={connected}
        height={HEADER_H}
      />

      {/* Middle: track (left) + side rankings (right). Force LTR so the race
          flows visually left-to-right regardless of the parent's RTL. */}
      <div dir="ltr" className="flex" style={{ height: STAGE_HEIGHT - HEADER_H }}>
        <RaceTrack
          horses={horses}
          width={STAGE_WIDTH - SIDE_W}
          height={STAGE_HEIGHT - HEADER_H}
        />
        <CurrentRankings
          horses={horses}
          width={SIDE_W}
          height={STAGE_HEIGHT - HEADER_H}
        />
      </div>

      {/* Winner overlay */}
      <WinnerModal winners={winners} />

      {/* Dev controls */}
      {showDev && <DevPanel onMessage={handleMessage} connected={connected} />}
    </main>
  )
}
