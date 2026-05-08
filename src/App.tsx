import { useEffect, useMemo, useRef, useState } from 'react'
import { BrainPanel } from './components/BrainPanel'
import { KaraokeText } from './components/KaraokeText'
import { LearningPanel } from './components/LearningPanel'
import { SceneAtmosphere } from './components/SceneAtmosphere'
import { storyScenes } from './data/storyScenes'
import { useAdaptiveMusic } from './hooks/useAdaptiveMusic'
import { getEmotionIntensity } from './utils/emotionIntensity'
import { getVoiceSegments, pickVoice, voiceProfiles } from './utils/voiceSegments'
import './index.css'

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showLearning, setShowLearning] = useState(true)
  const [activeSpeaker, setActiveSpeaker] = useState('Narrator')
  const [largeText, setLargeText] = useState(false)
  const [dyslexiaMode, setDyslexiaMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [slowNarration, setSlowNarration] = useState(false)
  const shouldContinueRef = useRef(false)
  const timerRef = useRef<number | undefined>(undefined)
  const scene = useMemo(() => storyScenes[sceneIndex], [sceneIndex])
  const music = useAdaptiveMusic(scene.emotion, isPlaying && !isPaused)
  const intensity = getEmotionIntensity(scene.emotion, isPlaying && !isPaused)

  const playClick = () => { const A = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; const audio = new A(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = 620; oscillator.type = 'sine'; gain.gain.setValueAtTime(0.035, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08); oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.08) }
  const clearTimer = () => { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = undefined }

  useEffect(() => { window.speechSynthesis.getVoices(); return () => { window.speechSynthesis.cancel(); clearTimer() } }, [])

  const speakSegment = (sceneIdx: number, segmentIdx: number, wordOffset: number) => {
    clearTimer()
    const currentScene = storyScenes[sceneIdx]
    const segments = getVoiceSegments(currentScene.title, currentScene.text)
    const segment = segments[segmentIdx]
    if (!segment) {
      if (shouldContinueRef.current && sceneIdx < storyScenes.length - 1) window.setTimeout(() => speakSegment(sceneIdx + 1, 0, 0), 650)
      else { shouldContinueRef.current = false; setIsPlaying(false); setIsPaused(false); setActiveSpeaker('Narrator') }
      return
    }
    const segmentWords = segment.text.split(' ')
    const profile = voiceProfiles[segment.role]
    const utterance = new SpeechSynthesisUtterance(segment.text)
    utterance.rate = profile.rate * (slowNarration ? 0.82 : 1)
    utterance.pitch = profile.pitch
    utterance.voice = pickVoice(segment.role) || null
    utterance.onstart = () => {
      setIsPlaying(true); setIsPaused(false); setSceneIndex(sceneIdx); setActiveSpeaker(segment.role.charAt(0).toUpperCase() + segment.role.slice(1)); setActiveWordIndex(wordOffset)
      timerRef.current = window.setInterval(() => setActiveWordIndex((current) => Math.min(current + 1, wordOffset + segmentWords.length - 1)), slowNarration ? 500 : 390)
    }
    utterance.onend = () => {
      clearTimer(); setActiveWordIndex(wordOffset + segmentWords.length - 1)
      if (!shouldContinueRef.current) { setIsPlaying(false); setIsPaused(false); return }
      window.setTimeout(() => speakSegment(sceneIdx, segmentIdx + 1, wordOffset + segmentWords.length), 180)
    }
    window.speechSynthesis.speak(utterance)
  }

  const togglePlayPause = () => {
    playClick()
    if (isPlaying && !isPaused) { window.speechSynthesis.pause(); clearTimer(); setIsPaused(true); return }
    if (isPlaying && isPaused) { window.speechSynthesis.resume(); setIsPaused(false); const words = storyScenes[sceneIndex].text.split(' '); timerRef.current = window.setInterval(() => setActiveWordIndex((current) => Math.min(current + 1, words.length - 1)), slowNarration ? 500 : 390); return }
    shouldContinueRef.current = true; window.speechSynthesis.cancel(); speakSegment(sceneIndex, 0, 0)
  }

  const stopNarration = () => { playClick(); shouldContinueRef.current = false; window.speechSynthesis.cancel(); clearTimer(); setIsPlaying(false); setIsPaused(false); setActiveWordIndex(-1); setActiveSpeaker('Narrator') }
  const goToScene = (index: number) => { playClick(); stopNarration(); setSceneIndex(index) }
  const shellClass = ['app-shell', largeText ? 'large-text' : '', dyslexiaMode ? 'dyslexia-mode' : '', highContrast ? 'high-contrast' : ''].join(' ')

  return <div className={shellClass}>
    <header className="topbar">
      <div><h1>The Mother’s Emotional Story</h1><p className="subtitle">A journey through love, stress, honesty, forgiveness, and connection.</p></div>
      <div className="top-actions"><button className="top-action" onClick={() => music.toggleMusic()}>{music.enabled ? '🔊 Sound On' : '🔇 Sound Off'}</button><button className="top-action" onClick={() => setShowLearning((value) => !value)}>ⓘ About This Story</button></div>
    </header>

    <main className="experience-grid">
      <section className="story-dashboard">
        <aside className="scene-rail" aria-label="Scene navigation">
          <div className="rail-title">Scenes</div>
          {storyScenes.map((item, index) => <button key={item.title} className={index === sceneIndex ? 'scene-nav active-scene' : 'scene-nav'} onClick={() => goToScene(index)}><span>{index + 1}</span><strong>{item.title}</strong></button>)}
        </aside>

        <section className="stage-area">
          <div className="scene-art cinematic-stage" style={{ background: scene.gradient }}>
            <SceneAtmosphere emotion={scene.emotion} />
            <div className="art-icon">{scene.icon}</div>
            <div className="story-caption"><div className="speaker-name">{activeSpeaker}</div><KaraokeText text={scene.text} activeWordIndex={activeWordIndex} /></div>
          </div>

          <div className="media-dock">
            <div className="controls primary-controls"><button className="control-button music-on" aria-label={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'} onClick={togglePlayPause}>{isPlaying && !isPaused ? '⏸' : '▶'}</button><button className="control-button secondary" aria-label="Previous scene" onClick={() => goToScene(sceneIndex === 0 ? storyScenes.length - 1 : sceneIndex - 1)}>⏮</button><button className="control-button secondary" aria-label="Next scene" onClick={() => goToScene(sceneIndex + 1 >= storyScenes.length ? 0 : sceneIndex + 1)}>⏭</button><button className="control-button secondary" aria-label="Stop narration" onClick={stopNarration}>⏹</button></div>
            <div className={music.enabled ? 'waveform active' : 'waveform'}>{Array.from({ length: 42 }).map((_, index) => <span key={index} />)}</div>
            <button className="replay-button" onClick={() => { stopNarration(); shouldContinueRef.current = true; speakSegment(sceneIndex, 0, 0) }}>↻ Replay Scene</button>
            <button className="next-button" onClick={() => goToScene(sceneIndex + 1 >= storyScenes.length ? 0 : sceneIndex + 1)}>Next Scene →</button>
          </div>

          <div className="stage-footer">
            <div className="accessibility-bar" aria-label="Read along accessibility controls"><button className={largeText ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setLargeText((v) => !v)}>A+</button><button className={dyslexiaMode ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setDyslexiaMode((v) => !v)}>Dys</button><button className={highContrast ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setHighContrast((v) => !v)}>HC</button><button className={slowNarration ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setSlowNarration((v) => !v)}>Slow</button></div>
            <div className="speaking-line">Speaking: <strong>{activeSpeaker}</strong></div>
            <label className="autoplay-switch"><span>Music</span><input type="range" min="0" max="0.5" step="0.01" value={music.volume} onChange={(event) => music.setVolume(Number(event.target.value))} /></label>
          </div>
        </section>
      </section>

      <BrainPanel emotion={scene.emotion} color={scene.color} brainAreas={scene.brainAreas} sideEffects={scene.sideEffects} intensity={intensity} />
    </main>

    {showLearning && <LearningPanel emotion={scene.emotion} brainAreas={scene.brainAreas} sceneTitle={scene.title} />}
  </div>
}
