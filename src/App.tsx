export default function App() {
  return (
    <div className="app-shell">
      <div className="hero-panel">
        <div className="story-panel">
          <h1>When Love Runs Home</h1>
          <h2>An Interactive Emotional Story</h2>

          <div className="scene-card">
            <div className="scene-image">
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop"
                alt="Mother and children"
              />
            </div>

            <div className="story-text">
              Maya and Jonah sat quietly at the kitchen table. They had been grounded because they had disobeyed their mother the day before.
            </div>

            <div className="controls">
              <button>▶ Narrate Story</button>
              <button>⏭ Next Scene</button>
            </div>
          </div>
        </div>

        <aside className="brain-panel">
          <h3>Mother’s Emotion</h3>

          <div className="emotion-badge concern">
            Concerned Love
          </div>

          <div className="brain-placeholder">
            🧠
          </div>

          <div className="brain-details">
            <strong>Brain Area:</strong>
            <p>Prefrontal Cortex</p>
          </div>

          <div className="brain-details">
            <strong>What this controls:</strong>
            <p>
              Planning, decision-making, emotional regulation, and protective caregiving.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
