import { Brain3D } from './Brain3D'

type BrainPanelProps = { emotion: string; color: string; brainAreas: string[]; sideEffects: string[] }

export function BrainPanel({ emotion, color, brainAreas, sideEffects }: BrainPanelProps) {
  return (
    <aside className="brain-panel">
      <h2>Mother’s Emotional State</h2>
      <div className="emotion-badge" style={{ background: color }}>{emotion}</div>
      <Brain3D color={color} brainAreas={brainAreas} />
      <div className="info-block"><h3>Brain Areas</h3><ul>{brainAreas.map((area) => <li key={area}>{area}</li>)}</ul></div>
      {sideEffects.length > 0 && <div className="warning-block"><h3>Possible Negative Side Effects</h3><ul>{sideEffects.map((effect) => <li key={effect}>{effect}</li>)}</ul></div>}
    </aside>
  )
}
