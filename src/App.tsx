import { useEffect, useMemo, useRef, useState } from 'react'
import { BrainPanel } from './components/BrainPanel'
import { KaraokeText } from './components/KaraokeText'
import { storyScenes } from './data/storyScenes'
import { useAdaptiveMusic } from './hooks/useAdaptiveMusic'
import './index.css'

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const shouldContinueRef = useRef(false)
  const timerRef = useRef<number | undefined>(undefined)
  const scene = useMemo(() => storyScenes[sceneIndex], [sceneIndex])
  const music = useAdaptiveMusic(scene.emotion, isPlaying && !isPaused)

  const playClick = () => { const A = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; const audio = new A(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = 620; oscillator.type = 'sine'; gain.gain.setValueAtTime(0.035, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08); oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.08) }
  const clearTimer = () => { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = undefined }
  useEffect(() => () => { window.speechSynthesis.cancel(); clearTimer() }, [])

  const speakScene = (index: number) => { clearTimer(); const currentScene = storyScenes[index]; const words = currentScene.text.split(' '); const utterance = new SpeechSynthesisUtterance(currentScene.text); utterance.rate = 0.9; utterance.pitch = 1; utterance.onstart = () => { setIsPlaying(true); setIsPaused(false); setSceneIndex(index); setActiveWordIndex(0); timerRef.current = window.setInterval(() => setActiveWordIndex((current) => Math.min(current + 1, words.length - 1)), 390) }; utterance.onend = () => { clearTimer(); setActiveWordIndex(words.length - 1); if (shouldContinueRef.current && index < storyScenes.length - 1) window.setTimeout(() => speakScene(index + 1), 650); else { shouldContinueRef.current = false; setIsPlaying(false); setIsPaused(false) } }; window.speechSynthesis.speak(utterance) }
  const togglePlayPause = () => { playClick(); if (isPlaying && !isPaused) { window.speechSynthesis.pause(); clearTimer(); setIsPaused(true); return } if (isPlaying && isPaused) { window.speechSynthesis.resume(); setIsPaused(false); const words = storyScenes[sceneIndex].text.split(' '); timerRef.current = window.setInterval(() => setActiveWordIndex((current) => Math.min(current + 1, words.length - 1)), 390); return } shouldContinueRef.current = true; window.speechSynthesis.cancel(); speakScene(sceneIndex) }
  const stopNarration = () => { playClick(); shouldContinueRef.current = false; window.speechSynthesis.cancel(); clearTimer(); setIsPlaying(false); setIsPaused(false); setActiveWordIndex(-1) }
  const goToScene = (index: number) => { playClick(); stopNarration(); setSceneIndex(index) }

  return <div className="app-shell"><header className="topbar"><div><p className="eyebrow">Interactive children’s story</p><h1>When Love Runs Home</h1><p className="subtitle">A gentle story about obedience, fear, honesty, forgiveness, and the love of a mother.</p></div><div className="scene-counter">Scene {sceneIndex + 1} / {storyScenes.length}</div></header><main className="layout-grid"><section className="story-panel"><div className="scene-art fade-in" style={{ background: scene.gradient }}><div className="art-icon">{scene.icon}</div><div className="art-caption">{scene.illustration}</div></div><div className="scene-content"><div className="scene-tag">{scene.title}</div><KaraokeText text={scene.text} activeWordIndex={activeWordIndex} /><div className="controls"><button className="control-button" title={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'} onClick={togglePlayPause}>{isPlaying && !isPaused ? '⏸' : '▶'}</button><button className="control-button secondary" title="Stop narration" onClick={stopNarration}>⏹</button><button className="control-button secondary" title="Previous scene" onClick={() => goToScene(sceneIndex === 0 ? storyScenes.length - 1 : sceneIndex - 1)}>⏮</button><button className="control-button secondary" title="Next scene" onClick={() => goToScene(sceneIndex + 1 >= storyScenes.length ? 0 : sceneIndex + 1)}>⏭</button></div><div className="audio-controls"><button className={music.enabled ? 'control-button music-on' : 'control-button secondary'} title={music.enabled ? 'Turn music off' : 'Turn music on'} onClick={() => { playClick(); music.toggleMusic() }}>{music.enabled ? '🎵' : '🔇'}</button><label className="volume-control" title="Music volume"><span>Music</span><input type="range" min="0" max="0.5" step="0.01" value={music.volume} onChange={(event) => music.setVolume(Number(event.target.value))} /></label><div className={music.enabled ? 'audio-meter active' : 'audio-meter'}><span></span><span></span><span></span></div></div><div className="timeline">{storyScenes.map((item, index) => <button key={item.title} title={item.title} className={index === sceneIndex ? 'dot active-dot' : 'dot'} onClick={() => goToScene(index)}>{index + 1}</button>)}</div></div></section><BrainPanel emotion={scene.emotion} color={scene.color} brainAreas={scene.brainAreas} sideEffects={scene.sideEffects} /></main></div>
}
