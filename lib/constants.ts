// Race target - country reaches finish at this score
export const TARGET_POINTS = 100_000

// Comments
export const COMMENT_POINTS = 1
// Comment boost ms (not used in new system, kept for compatibility)
export const COMMENT_BOOST_MS = 3000

// Gifts (treated as coins/diamonds)
export const GIFT_POINTS_PER_DIAMOND = 1
export const GIFT_BOOST_MS_PER_DIAMOND = 60
export const MIN_GIFT_BOOST_MS = 3000

// Sprite animation durations (seconds)
export const ANIM_DURATION_IDLE = 1.2
export const ANIM_DURATION_COMMENT = 0.6
export const ANIM_DURATION_BOOST = 0.25

// Layout — large enough to comfortably fit 22 lanes
export const STAGE_WIDTH = 1100
export const STAGE_HEIGHT = 1080

// WebSocket
export const WS_URL = "ws://localhost:8080"

// Winner modal
export const WINNER_DISPLAY_MS = 10_000

// Consumption rates (points per second)
// السرعة الأساسية للحالة comment (عندما تكون النقاط المتراكمة قليلة)
export const BASE_CONSUMPTION_RATE = 1
// مقدار زيادة السرعة لكل نقطة متراكمة
export const SCALE_CONSUMPTION_RATE = 0.05
// الحد الأقصى لسرعة comment (لئلا تصبح سريعة جداً)
export const MAX_COMMENT_RATE = 300
// سرعة ثابتة لحالة boost (للهدايا)
export const CONSUMPTION_RATE_BOOST = 1000
