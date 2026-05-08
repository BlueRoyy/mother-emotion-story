const intensityMap: Record<string, number> = {
  'Concerned Love': 0.42,
  'Responsible Focus': 0.5,
  'Trusting Hope': 0.38,
  'Uneasy Anticipation': 0.68,
  Fear: 0.92,
  'Suspicion and Worry': 0.76,
  'Alarm and Urgency': 1,
  'Protective Love': 0.64,
  'Sadness and Relief': 0.58,
  'Peace and Restored Love': 0.32,
}

export function getEmotionIntensity(emotion: string, isNarrating: boolean) {
  const base = intensityMap[emotion] ?? 0.5
  return isNarrating ? Math.min(1, base + 0.16) : base * 0.72
}
