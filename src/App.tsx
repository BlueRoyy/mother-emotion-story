import { useMemo, useState } from 'react'
import { storyScenes } from './data/storyScenes'
import './index.css'

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0)

  const scene = useMemo(() => storyScenes[sceneIndex], [sceneIndex])

  const narrate = () => {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(scene.text)
    utterance.rate = 0.9
    utterance.pitch = 1

    window.speechSynthesis.speak(utterance)
  }

  const nextScene = () => {
    setSceneIndex((prev) =>
      prev + 1 >= storyScenes.length ? 0 : prev + 1,
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>When Love Runs Home</h1>
          <p>
            An interactive emotional story exploring love, fear,
            forgiveness, and reconciliation.
          </p>
        </div>

        <div className="scene-counter">
          Scene {sceneIndex + 1} / {storyScenes.length}
        </div>
      </header>

      <main className="layout-grid">
        <section className="story-panel">
          <div className="scene-image">
            <img src={scene.image} alt={scene.title} />
          </div>

          <div className="scene-content">
            <div className="scene-tag">{scene.title}</div>

            <div className="story-text">
              {scene.text}
            </div>

            <div className="controls">
              <button onClick={narrate}>▶ Narrate</button>
              <button onClick={nextScene}>⏭ Next Scene</button>
            </div>
          </div>
        </section>

        <aside className="brain-panel">
          <h2>Mother’s Emotional State</h2>

          <div
            className="emotion-badge"
            style={{ background: scene.color }}
          >
            {scene.emotion}
          </div>

          <div className="brain-graphic">
            🧠
          </div>

          <div className="info-block">
            <h3>Brain Areas</h3>
            <ul>
              {scene.brainAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          {scene.sideEffects.length > 0 && (
            <div className="warning-block">
              <h3>Possible Side Effects</h3>

              <ul>
                {scene.sideEffects.map((effect) => (
                  <li key={effect}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
