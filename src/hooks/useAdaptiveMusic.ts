import { useEffect, useRef, useState } from 'react'

const MUSIC_SRC = '/audio/background-music.mp3'

export function useAdaptiveMusic(_emotion: string, isNarrating: boolean) {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [status, setStatus] = useState('Music off')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audio.addEventListener('canplay', () => setStatus('Music ready'))
    audio.addEventListener('error', () => setStatus('Music file not found. Check public/audio/background-music.mp3'))
    audioRef.current = audio
    return audio
  }

  const toggleMusic = async () => {
    const audio = ensureAudio()
    if (enabled) {
      audio.pause()
      setEnabled(false)
      setStatus('Music paused')
      return
    }
    try {
      setStatus('Starting music...')
      audio.volume = volume
      await audio.play()
      setEnabled(true)
      setStatus('Music playing')
    } catch (error) {
      console.warn('Background music could not start:', error)
      setEnabled(false)
      setStatus('Music failed to play. Tap again or check MP3 path.')
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = enabled ? volume * (isNarrating ? 0.35 : 1) : 0
    if (enabled) setStatus(isNarrating ? 'Music ducked for narration' : 'Music playing')
  }, [enabled, volume, isNarrating])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  return { enabled, volume, setVolume, toggleMusic, source: MUSIC_SRC, status }
}
