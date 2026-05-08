import { useEffect, useRef, useState } from 'react'

const MUSIC_SRC = '/audio/background-music.mp3'

export function useAdaptiveMusic(_emotion: string, isNarrating: boolean) {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audioRef.current = audio
    return audio
  }

  const toggleMusic = async () => {
    const audio = ensureAudio()

    if (enabled) {
      audio.pause()
      setEnabled(false)
      return
    }

    try {
      await audio.play()
      setEnabled(true)
    } catch (error) {
      console.warn('Background music could not start:', error)
      setEnabled(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = enabled ? volume * (isNarrating ? 0.35 : 1) : 0
  }, [enabled, volume, isNarrating])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  return { enabled, volume, setVolume, toggleMusic, source: MUSIC_SRC }
}
