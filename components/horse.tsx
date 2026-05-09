"use client"

import { ANIM_DURATION_BOOST, ANIM_DURATION_COMMENT, ANIM_DURATION_IDLE } from "@/lib/constants"
import type { HorseState } from "@/lib/types"

interface HorseProps {
  state: HorseState
  /** Horizontal display size in px */
  width?: number
  /** Vertical display size in px */
  height?: number
}

/**
 * Renders a single galloping horse using a 3-row spritesheet:
 *   row 0 = idle (LIGHT TROT)
 *   row 1 = comment-run (NORMAL RUN)
 *   row 2 = boost (MAXIMUM SPRINT)
 *
 * The cleaned spritesheet is 8 cols × 3 rows of 128×128 SQUARE tiles
 * (1024×384 total). Render at any size you want, but keep the on-screen
 * aspect ratio 1:1 to match the source tile shape.
 *
 * The image has 8 frames per row, animated with `steps(8)` so movement is
 * frame-by-frame. The duration changes per state: 1.2s / 0.6s / 0.25s.
 */
export function Horse({ state, width = 64, height = 64 }: HorseProps) {
  // 8 frames wide, 3 rows tall (square tiles).
  const sheetW = width * 8
  const sheetH = height * 3
  const yOffset = state === "idle" ? 0 : state === "comment" ? -height : -height * 2
  const duration =
    state === "idle"
      ? ANIM_DURATION_IDLE
      : state === "comment"
        ? ANIM_DURATION_COMMENT
        : ANIM_DURATION_BOOST

  return (
    <div
      aria-hidden
      className="horse-sprite"
      style={
        {
          width,
          height,
          backgroundImage: "url(/horse-sprite.png)",
          backgroundSize: `${sheetW}px ${sheetH}px`,
          backgroundPositionX: "0px",
          backgroundPositionY: `${yOffset}px`,
          backgroundRepeat: "no-repeat",
          // Provide the sheet width to the keyframe via a CSS variable so the
          // animation walks the full row regardless of the rendered size.
          ["--sheet-w" as string]: `${sheetW}px`,
          animation: `horse-run-${state} ${duration}s steps(8) infinite`,
          imageRendering: "auto",
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))",
        } as React.CSSProperties
      }
    />
  )
}
