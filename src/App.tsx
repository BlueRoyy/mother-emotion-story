import { useEffect, useMemo, useRef, useState } from 'react'
import { BrainPanel } from './components/BrainPanel'
import { KaraokeText } from './components/KaraokeText'
import { LearningPanel } from './components/LearningPanel'
import { SceneAtmosphere } from './components/SceneAtmosphere'
import { storyScenes } from './data/storyScenes'
import { useAdaptiveMusic } from './hooks/useAdaptiveMusic'
import { getVoiceSegments, pickVoice, voiceProfiles } from './utils/voiceSegments'
import { getEmotionIntensity } from './utils/emotionIntensity'
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

  return <div className={shellClass}><header className="topbar"><div><p className="eyebrow">Interactive children’s story</p><h1>When Love Runs Home</h1><p className="subtitle">A gentle story about obedience, fear, honesty, forgiveness, and the love of a mother.</p></div><div className="scene-counter">Scene {sceneIndex + 1} / {storyScenes.length}</div></header><main className="layout-grid"><section className="story-panel"><div className="scene-art fade-in" style={{ background: scene.gradient }}><SceneAtmosphere emotion={scene.emotion} /><div className="art-icon">{scene.icon}</div><div className="art-caption">{scene.illustration}</div></div><div className="scene-content"><div className="scene-tag">{scene.title}</div><div className="speaker-badge">Speaking: {activeSpeaker}</div><div className="accessibility-bar" aria-label="Read along accessibility controls"><button className={largeText ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setLargeText((v) => !v)} title="Large read-along text">A+</button><button className={dyslexiaMode ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setDyslexiaMode((v) => !v)} title="Dyslexia-friendly spacing">Dys</button><button className={highContrast ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setHighContrast((v) => !v)} title="High contrast reading">HC</button><button className={slowNarration ? 'mini-toggle active-mini' : 'mini-toggle'} onClick={() => setSlowNarration((v) => !v)} title="Slower narration">Slow</button></div><KaraokeText text={scene.text} activeWordIndex={activeWordIndex} /><div className="controls"><button className="control-button" aria-label={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'} title={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'} onClick={togglePlayPause}>{isPlaying && !isPaused ? '⏸' : '▶'}</button><button className="control-button secondary" aria-label="Stop narration" title="Stop narration" onClick={stopNarration}>⏹</button><button className="control-button secondary" aria-label="Previous scene" title="Previous scene" onClick={() => goToScene(sceneIndex === 0 ? storyScenes.length - 1 : sceneIndex - 1)}>⏮</button><button className="control-button secondary" aria-label="Next scene" title="Next scene" onClick={() => goToScene(sceneIndex + 1 >= storyScenes.length ? 0 : sceneIndex + 1)}>⏭</button><button className={showLearning ? 'control-button music-on' : 'control-button secondary'} aria-label="Toggle emotional learning" title="Toggle emotional learning" onClick={() => { playClick(); setShowLearning((value) => !value) }}>💡</button></div><div className="audio-controls"><button className={music.enabled ? 'control-button music-on' : 'control-button secondary'} title={music.enabled ? 'Turn music off' : 'Turn music on'} onClick={() => { playClick(); music.toggleMusic() }}>{music.enabled ? '🎵' : '🔇'}</button><label className="volume-control" title="Music volume"><span>Music</span><input type="range" min="0" max="0.5" step="0.01" value={music.volume} onChange={(event) => music.setVolume(Number(event.target.value))} /></label><div className={music.enabled ? 'audio-meter active' : 'audio-meter'}><span></span><span></span><span></span></div><span className="audio-status">{music.status}</span></div><div className="timeline">{storyScenes.map((item, index) => <button key={item.title} title={item.title} className={index === sceneIndex ? 'dot active-dot' : 'dot'} onClick={() => goToScene(index)}>{index + 1}</button>)}</div></div></section><BrainPanel emotion={scene.emotion} color={scene.color} brainAreas={scene.brainAreas} sideEffects={scene.sideEffects} intensity={intensity} /></main>{showLearning && <LearningPanel emotion={scene.emotion} brainAreas={scene.brainAreas} sceneTitle={scene.title} />}</div>
}
