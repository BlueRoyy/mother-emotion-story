type BrainPanelProps = {
  emotion: string
  color: string
  brainAreas: string[]
  sideEffects: string[]
}

export function BrainPanel({
  emotion,
  color,
  brainAreas,
  sideEffects,
}: BrainPanelProps) {
  return (
    <aside className="brain-panel">
      <h2>Mother’s Emotional State</h2>

      <div className="emotion-badge" style={{ background: color }}>
        {emotion}
      </div>

      <svg
        className="brain-svg"
        viewBox="0 0 400 320"
        role="img"
        aria-label="Stylized brain illustration"
      >
        <path
          className="brain-base"
          d="M112 58c-31 0-56 26-56 58 0 16 6 30 16 41-8 10-12 22-12 36 0 34 28 61 62 61h151c37 0 67-30 67-67 0-15-5-29-13-40 11-11 18-26 18-42 0-34-27-61-61-61-14 0-28 5-38 13-12-18-32-29-55-29-24 0-45 12-56 30-7-6-15-10-23-10z"
        />

        <circle cx="150" cy="115" r="34" fill={color} className="highlight" />
        <circle cx="255" cy="165" r="30" fill={color} className="highlight" />
      </svg>

      <div className="info-block">
        <h3>Brain Areas</h3>

        <ul>
          {brainAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </div>

      {sideEffects.length > 0 && (
        <div className="warning-block">
          <h3>Possible Side Effects</h3>

          <ul>
            {sideEffects.map((effect) => (
              <li key={effect}>{effect}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
