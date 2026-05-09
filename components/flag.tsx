"use client"

import { COUNTRIES } from "@/lib/data/countries"
import { TRIBES } from "@/lib/data/tribes"

interface FlagProps {
  code: string
  className?: string
  width?: number
  height?: number
  alt?: string
}

export function Flag({ code, className, width = 32, height = 24, alt }: FlagProps) {
  // 1. إذا كان الكود يطابق دولة (مثل "sa", "eg") → نعرض العلم
  const country = COUNTRIES.find(c => c.code === code)
  if (country) {
    const w = width <= 40 ? 40 : width <= 80 ? 80 : width <= 160 ? 160 : 320
    return (
      <img
        src={`https://flagcdn.com/w${w}/${code}.png`}
        width={width}
        height={height}
        alt={alt ?? code}
        className={className}
        style={{ objectFit: "cover", borderRadius: 4 }}
        crossOrigin="anonymous"
      />
    )
  }

  // 2. قبيلة → نعرض دائرة ملونة بها رقم القبيلة
  const tribe = TRIBES.find(t => t.code === code)
  const bgColor = tribe?.color || "#888888"
  const displayCode = tribe?.code || code.slice(0, 4)  // مثلاً "505" بدلاً من "قح"
  const fontSize = Math.max(12, Math.min(20, width * 0.5))
  const borderRadius = width / 2  // دائري بالكامل

  return (
    <div
      className={`flex items-center justify-center font-mono font-bold ${className || ""}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        borderRadius,
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        color: "#fff",
        fontSize,
        textShadow: "0 1px 1px rgba(0,0,0,0.5)",
      }}
      title={tribe?.name || code}
    >
      {displayCode}
    </div>
  )
}