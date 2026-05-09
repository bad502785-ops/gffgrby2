"use client"

import { useState } from "react"
import { getActiveEntities } from "@/lib/race-entities"
import type { IncomingMessage } from "@/lib/types"
import { Flag } from "./flag"

interface DevPanelProps {
  onMessage: (msg: IncomingMessage) => void
  connected: boolean
}

export function DevPanel({ onMessage, connected }: DevPanelProps) {
  const [open, setOpen] = useState(false)
  const participants = getActiveEntities()
  const [selectedCode, setSelectedCode] = useState<string>(participants[0]?.code || "")
  const [diamonds, setDiamonds] = useState(100)

  const sendComment = () => {
    const entity = participants.find(p => p.code === selectedCode)
    if (!entity) return
    const commentText = entity.aliases?.[0] || entity.name
    onMessage({
      type: "comment",
      comment: commentText,
      userId: `dev-${selectedCode}`,
    })
  }

  const sendGift = () => {
    onMessage({
      type: "gift",
      giftName: "Rose",
      diamonds,
      repeat: 1,
      userId: `dev-${selectedCode}`,
    })
  }

  if (!open) {
    return (
      <div className="absolute bottom-2 left-2 z-40 select-none">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded bg-stone-900/90 px-2 py-1 text-[10px] font-mono text-amber-300 hover:bg-stone-800"
        >
          DEV
        </button>
      </div>
    )
  }

  return (
    <div className="absolute bottom-2 left-2 z-40 w-[280px] rounded-lg border border-amber-900/40 bg-stone-950/95 p-2 text-xs text-amber-100 shadow-2xl">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-bold">Dev Panel</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px]"
        >
          ✕
        </button>
      </div>

      <div className="mb-1 text-[10px] text-stone-400">
        WS: {connected ? "✅ متصل" : "❌ غير متصل (ws://localhost:8080)"}
      </div>

      <label className="mb-1 block text-[10px] text-stone-400">Participant</label>
      <div className="mb-2 flex items-center gap-1">
        <Flag code={selectedCode} width={22} height={14} />
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="flex-1 rounded bg-stone-800 px-1 py-0.5 text-xs"
        >
          {participants.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={sendComment}
          className="rounded bg-emerald-700 px-1.5 py-1 text-[11px] font-bold hover:bg-emerald-600"
        >
          Comment +100
        </button>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={diamonds}
            onChange={(e) => setDiamonds(Number(e.target.value) || 0)}
            className="w-12 rounded bg-stone-800 px-1 py-0.5 text-[11px]"
          />
          <button
            type="button"
            onClick={sendGift}
            className="flex-1 rounded bg-rose-700 px-1.5 py-1 text-[11px] font-bold hover:bg-rose-600"
          >
            Gift 💎
          </button>
        </div>
      </div>
    </div>
  )
}