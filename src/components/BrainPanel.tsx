import { Brain3D } from './Brain3D'

type BrainPanelProps = { emotion: string; color: string; brainAreas: string[]; sideEffects: string[]; intensity?: number }

export function BrainPanel({ emotion, color, brainAreas, sideEffects, intensity = 0.5 }: BrainPanelProps) {
  return (
    <aside className="brain-panel">
      <h2>Mother’s Emotional State</h2>
      <div className="emotion-badge" style={{ background: color, boxShadow: `0 0 ${18 + intensity * 40}px ${color}` }}>{emotion}</div>
      <Brain3D color={color} brainAreas={brainAreas} intensity={intensity} />
      <div className="emotion-meter">
        <div className="emotion-meter-labels">
          <span>Emotional Activity</span>
          <span>{Math.round(intensity * 100)}%</span>
        </div>
        <div className="emotion-meter-track">
          <div className="emotion-meter-fill" style={{ width: `${Math.max(12, intensity * 100)}%`, background: color }} />
        </div>
      </div>
      <div className="info-block"><h3>Brain Areas</h3><ul>{brainAreas.map((area) => <li key={area}>{area}</li>)}</ul></div>
      {sideEffects.length > 0 && <div className="warning-block"><h3>Possible Negative Side Effects</h3><ul>{sideEffects.map((effect) => <li key={effect}>{effect}</li>)}</ul></div>}
    </aside>
  )
}
