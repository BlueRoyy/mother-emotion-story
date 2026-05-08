import { useEffect, useMemo, useState } from 'react'
import { BrainPanel } from './components/BrainPanel'
import { KaraokeText } from './components/KaraokeText'
import { storyScenes } from './data/storyScenes'
import './index.css'

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(-1)
  const [isNarrating, setIsNarrating] = useState(false)

  const scene = useMemo(() => storyScenes[sceneIndex], [sceneIndex])

  useEffect(() => {
    window.speechSynthesis.cancel()
    setActiveWordIndex(-1)
    setIsNarrating(false)
  }, [sceneIndex])

  const narrate = () => {
    window.speechSynthesis.cancel()

    const words = scene.text.split(' ')
    const utterance = new SpeechSynthesisUtterance(scene.text)
    utterance.rate = 0.9
    utterance.pitch = 1

    let timer: number | undefined

    utterance.onstart = () => {
      setIsNarrating(true)
      setActiveWordIndex(0)
      const approxMsPerWord = 420
      timer = window.setInterval(() => {
        setActiveWordIndex((current) => {
          if (current >= words.length - 1) {
            if (timer) window.clearInterval(timer)
            return current
          }
          return current + 1
        })
      }, approxMsPerWord)
    }

    utterance.onend = () => {
      if (timer) window.clearInterval(timer)
      setIsNarrating(false)
      setActiveWordIndex(words.length - 1)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopNarration = () => {
    window.speechSynthesis.cancel()
    setIsNarrating(false)
  }

  const nextScene = () => {
    setSceneIndex((prev) => (prev + 1 >= storyScenes.length ? 0 : prev + 1))
  }

  const previousScene = () => {
    setSceneIndex((prev) => (prev === 0 ? storyScenes.length - 1 : prev - 1))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Interactive children’s story</p>
          <h1>When Love Runs Home</h1>
          <p className="subtitle">
            A gentle story about obedience, fear, honesty, forgiveness, and the love of a mother.
          </p>
        </div>
        <div className="scene-counter">Scene {sceneIndex + 1} / {storyScenes.length}</div>
      </header>

      <main className="layout-grid">
        <section className="story-panel">
          <div className="scene-art" style={{ background: scene.gradient }}>
            <div className="art-glow" />
            <div className="art-icon">{scene.icon}</div>
            <div className="art-caption">{scene.illustration}</div>
          </div>

          <div className="scene-content">
            <div className="scene-tag">{scene.title}</div>
            <KaraokeText text={scene.text} activeWordIndex={activeWordIndex} />

            <div className="controls">
              <button onClick={narrate}>{isNarrating ? 'Restart Narration' : 'Narrate Scene'}</button>
              <button className="secondary" onClick={stopNarration}>Stop</button>
              <button className="secondary" onClick={previousScene}>Previous</button>
              <button onClick={nextScene}>Next Scene</button>
            </div>
          </div>
        </section>

        <BrainPanel
          emotion={scene.emotion}
          color={scene.color}
          brainAreas={scene.brainAreas}
          sideEffects={scene.sideEffects}
        />
      </main>
    </div>
  )
}
