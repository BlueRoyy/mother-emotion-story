import type { CSSProperties } from 'react'

type SceneAtmosphereProps = { emotion: string }

const moodClass: Record<string, string> = {
  'Concerned Love': 'mood-calm',
  'Responsible Focus': 'mood-calm',
  'Trusting Hope': 'mood-gold',
  'Uneasy Anticipation': 'mood-tension',
  Fear: 'mood-fear',
  'Suspicion and Worry': 'mood-worry',
  'Alarm and Urgency': 'mood-urgent',
  'Protective Love': 'mood-love',
  'Sadness and Relief': 'mood-rain',
  'Peace and Restored Love': 'mood-gold',
}

export function SceneAtmosphere({ emotion }: SceneAtmosphereProps) {
  const mood = moodClass[emotion] || 'mood-calm'

  return (
    <div className={`scene-atmosphere ${mood}`} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} style={{ '--i': index } as CSSProperties} />
      ))}
    </div>
  )
}
