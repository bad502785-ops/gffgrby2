"use client"

import { useEffect, useRef, useState } from "react"
import type { IncomingMessage } from "@/lib/types"

/**
 * Connects to the local TikTok bridge WebSocket and forwards parsed
 * messages to `onMessage`. Reconnects automatically every 2 seconds.
 */
export function useWebSocket(url: string, onMessage: (msg: IncomingMessage) => void) {
  const [connected, setConnected] = useState(false)
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    let stopped = false
    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    function connect() {
      if (stopped) return
      try {
        ws = new WebSocket(url)
        ws.onopen = () => {
          console.log("[v0] WS connected:", url)
          setConnected(true)
        }
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as IncomingMessage
            handlerRef.current(data)
          } catch (err) {
            console.error("[v0] WS parse error:", err)
          }
        }
        ws.onclose = () => {
          setConnected(false)
          if (!stopped) {
            reconnectTimer = setTimeout(connect, 2000)
          }
        }
        ws.onerror = () => {
          // onclose will handle reconnect
        }
      } catch (err) {
        console.error("[v0] WS connect error:", err)
        if (!stopped) {
          reconnectTimer = setTimeout(connect, 2000)
        }
      }
    }

    connect()

    return () => {
      stopped = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [url])

  return { connected }
}
