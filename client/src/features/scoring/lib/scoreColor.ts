/** Maps a 0–100 score to a consistent color used by badges and report rings/bars. */
export function getScoreColor(score: number): string {
  if (score < 50) return '#dc2626' // red
  if (score < 65) return '#f59e0b' // amber
  if (score < 80) return '#eab308' // yellow
  if (score < 90) return '#16a34a' // green
  return '#059669'                 // emerald
}
