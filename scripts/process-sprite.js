/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Cleans the raw horse sprite sheet.
 *
 * The previous version filtered each cell with connected-components and
 * kept only the LARGEST blob, which sometimes dropped the horse's face
 * (head/neck) when anti-aliasing thinned the connection at low resolution.
 *
 * This version is intentionally simpler and safer:
 *   1) Make every grey/checker pixel transparent.
 *   2) Detect the 3 horse rows by horizontal projection (strict threshold
 *      so the thin title strips and digit strips between rows are ignored).
 *   3) Detect the 8 horse columns within each row by vertical projection
 *      so we cut at the actual gaps between horses (not at fixed 1/8 marks).
 *   4) For each detected horse cell, find its tight bbox of non-background
 *      pixels and copy ALL of them through. We only drop components
 *      strictly smaller than 40 pixels (anti-alias dust under hooves).
 *   5) Center the horse in a 128x128 tile, bottom-aligned so hooves rest
 *      at a consistent height across all frames.
 */

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const SRC = path.join(__dirname, "..", "public", "horse-sprite-original.png")
const OUT = path.join(__dirname, "..", "public", "horse-sprite.png")
const META_OUT = path.join(__dirname, "..", "public", "horse-sprite.json")

const COLS = 8
const ROWS = 3
const FRAME_W = 128
const FRAME_H = 128

// Pixel is "background" if it is nearly grey within the checker value range.
function isBackground(r, g, b, a) {
  if (a === 0) return true
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = max - min
  if (chroma > 22) return false
  const avg = (r + g + b) / 3
  return avg >= 110 && avg <= 235
}

async function main() {
  const img = sharp(SRC).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info
  console.log(`[v0] Source ${W}x${H} ch=${C}`)

  // ---------- 1) background -> transparent ----------
  const cleaned = Buffer.alloc(W * H * 4)
  const rowFill = new Uint32Array(H)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = C === 4 ? data[i + 3] : 255
      const o = (y * W + x) * 4
      if (isBackground(r, g, b, a)) {
        cleaned[o + 3] = 0
      } else {
        cleaned[o] = r
        cleaned[o + 1] = g
        cleaned[o + 2] = b
        cleaned[o + 3] = 255
        rowFill[y] += 1
      }
    }
  }

  // ---------- 2) detect 3 horse rows ----------
  // High threshold filters out the title strips ("LIGHT TROT" etc.) which
  // span only a small portion of the row, and the digits row which has
  // sparse fill (just 8 isolated numbers).
  const fillThreshold = Math.floor(W * 0.18)
  const minRowHeight = 50
  const bands = []
  let inBand = false
  let bandStart = 0
  for (let y = 0; y <= H; y++) {
    const filled = y < H && rowFill[y] > fillThreshold
    if (filled && !inBand) {
      inBand = true
      bandStart = y
    } else if (!filled && inBand) {
      inBand = false
      const h = y - bandStart
      if (h >= minRowHeight) bands.push({ y0: bandStart, y1: y, h })
    }
  }
  if (bands.length < 3) throw new Error(`expected 3 bands, got ${bands.length}`)
  bands.sort((a, b) => b.h - a.h)
  const rows = bands.slice(0, 3).sort((a, b) => a.y0 - b.y0)
  // Generous vertical padding so we don't clip mane / tail / hooves.
  for (const r of rows) {
    r.y0 = Math.max(0, r.y0 - 10)
    r.y1 = Math.min(H, r.y1 + 12)
  }
  console.log(`[v0] rows`, rows)

  // ---------- 3) detect 8 horse columns per row ----------
  // For each row, count non-background pixels per column. Then split that
  // 1D signal into 8 connected groups separated by empty gaps.
  function detectCols(row) {
    const colFill = new Uint32Array(W)
    for (let y = row.y0; y < row.y1; y++) {
      for (let x = 0; x < W; x++) {
        if (cleaned[(y * W + x) * 4 + 3] !== 0) colFill[x] += 1
      }
    }
    // Find runs of non-empty columns.
    const groups = []
    let inG = false
    let gStart = 0
    for (let x = 0; x <= W; x++) {
      const filled = x < W && colFill[x] > 0
      if (filled && !inG) {
        inG = true
        gStart = x
      } else if (!filled && inG) {
        inG = false
        groups.push({ x0: gStart, x1: x })
      }
    }
    // If a row has < 8 groups the horses overlap; merge to nearest neighbour
    // bullets won't help here. If > 8, drop the smallest extra groups.
    if (groups.length === 8) return groups
    if (groups.length > 8) {
      groups.sort((a, b) => b.x1 - b.x0 - (a.x1 - a.x0))
      const top = groups.slice(0, 8).sort((a, b) => a.x0 - b.x0)
      return top
    }
    // < 8 groups means some horses touched. Fall back to even splits.
    const colW = Math.floor(W / 8)
    const fb = []
    for (let i = 0; i < 8; i++) fb.push({ x0: i * colW, x1: i === 7 ? W : (i + 1) * colW })
    return fb
  }

  // ---------- 4) compose final 1024x384 sheet ----------
  const sheetW = COLS * FRAME_W
  const sheetH = ROWS * FRAME_H
  const sheet = Buffer.alloc(sheetW * sheetH * 4)
  const rowMeta = []

  for (let r = 0; r < 3; r++) {
    const row = rows[r]
    const cols = detectCols(row)
    // Add small horizontal padding so we capture stretched legs / tail tips.
    for (const c of cols) {
      c.x0 = Math.max(0, c.x0 - 4)
      c.x1 = Math.min(W, c.x1 + 4)
    }
    const cellMeta = []

    for (let c = 0; c < COLS; c++) {
      const col = cols[c]
      const cw = col.x1 - col.x0
      const ch = row.y1 - row.y0

      // Build cell mask
      const mask = new Uint8Array(cw * ch)
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          mask[y * cw + x] =
            cleaned[((row.y0 + y) * W + (col.x0 + x)) * 4 + 3] !== 0 ? 1 : 0
        }
      }

      // Drop only TINY components (<= 40 px) so we get rid of stray noise
      // while preserving the head/face even if it's a separated blob.
      const label = new Int32Array(cw * ch)
      const sizes = []
      sizes.push(0)
      let nextId = 1
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const idx = y * cw + x
          if (mask[idx] !== 1 || label[idx] !== 0) continue
          const id = nextId++
          let size = 0
          const stack = [idx]
          label[idx] = id
          while (stack.length) {
            const p = stack.pop()
            const py = (p / cw) | 0
            const px = p - py * cw
            size++
            const tryN = (np, nx, ny) => {
              if (nx < 0 || nx >= cw || ny < 0 || ny >= ch) return
              if (mask[np] === 1 && label[np] === 0) {
                label[np] = id
                stack.push(np)
              }
            }
            tryN(p - 1, px - 1, py)
            tryN(p + 1, px + 1, py)
            tryN(p - cw, px, py - 1)
            tryN(p + cw, px, py + 1)
            // 8-connectivity helps merge anti-aliased thin links.
            tryN(p - cw - 1, px - 1, py - 1)
            tryN(p - cw + 1, px + 1, py - 1)
            tryN(p + cw - 1, px - 1, py + 1)
            tryN(p + cw + 1, px + 1, py + 1)
          }
          sizes.push(size)
        }
      }

      // Find tight bbox over all non-tiny components.
      let bx0 = cw,
        by0 = ch,
        bx1 = -1,
        by1 = -1
      let kept = 0
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const id = label[y * cw + x]
          if (!id) continue
          if (sizes[id] < 40) continue
          kept++
          if (x < bx0) bx0 = x
          if (x > bx1) bx1 = x
          if (y < by0) by0 = y
          if (y > by1) by1 = y
        }
      }
      if (kept === 0) {
        cellMeta.push({ col: c, empty: true })
        continue
      }
      const bw = bx1 - bx0 + 1
      const bh = by1 - by0 + 1
      cellMeta.push({ col: c, bw, bh })

      // Copy kept pixels into a tight RGBA buffer.
      const sub = Buffer.alloc(bw * bh * 4)
      for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
          const lx = bx0 + x
          const ly = by0 + y
          const id = label[ly * cw + lx]
          if (!id || sizes[id] < 40) continue
          const o = ((row.y0 + ly) * W + (col.x0 + lx)) * 4
          const so = (y * bw + x) * 4
          sub[so] = cleaned[o]
          sub[so + 1] = cleaned[o + 1]
          sub[so + 2] = cleaned[o + 2]
          sub[so + 3] = 255
        }
      }

      // Resize preserving aspect ratio with a small inner padding.
      const pad = 6
      const scale = Math.min(
        (FRAME_W - pad * 2) / bw,
        (FRAME_H - pad * 2) / bh,
        1
      )
      const drawW = Math.max(1, Math.round(bw * scale))
      const drawH = Math.max(1, Math.round(bh * scale))
      const resized = await sharp(sub, {
        raw: { width: bw, height: bh, channels: 4 },
      })
        .resize(drawW, drawH, { fit: "fill", kernel: "lanczos3" })
        .raw()
        .toBuffer()

      // Bottom-aligned + horizontally centered placement on the tile.
      const tileX = c * FRAME_W
      const tileY = r * FRAME_H
      const offX = Math.floor((FRAME_W - drawW) / 2)
      const offY = FRAME_H - drawH - pad
      for (let y = 0; y < drawH; y++) {
        for (let x = 0; x < drawW; x++) {
          const si = (y * drawW + x) * 4
          const a = resized[si + 3]
          if (a === 0) continue
          const di = ((tileY + offY + y) * sheetW + (tileX + offX + x)) * 4
          sheet[di] = resized[si]
          sheet[di + 1] = resized[si + 1]
          sheet[di + 2] = resized[si + 2]
          sheet[di + 3] = a
        }
      }
    }
    rowMeta.push({ row: r, y0: row.y0, y1: row.y1, cells: cellMeta })
  }

  await sharp(sheet, { raw: { width: sheetW, height: sheetH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(OUT)

  fs.writeFileSync(
    META_OUT,
    JSON.stringify(
      { frameW: FRAME_W, frameH: FRAME_H, cols: COLS, rows: ROWS, rowMeta },
      null,
      2
    )
  )
  console.log(`[v0] Wrote ${OUT} (${sheetW}x${sheetH})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
