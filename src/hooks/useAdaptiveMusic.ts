import { useEffect, useRef, useState } from 'react'

const emotionFrequency: Record<string, number> = {
  'Concerned Love': 220,
  'Responsible Focus': 246,
  'Trusting Hope': 262,
  'Uneasy Anticipation': 196,
  Fear: 146,
  'Suspicion and Worry': 174,
  'Alarm and Urgency': 130,
  'Protective Love': 220,
  'Sadness and Relief': 164,
  'Peace and Restored Love': 294,
}

export function useAdaptiveMusic(emotion: string, isNarrating: boolean) {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(0.22)
  const audioRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const harmonyRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const ensureAudio = () => {
    if (audioRef.current) return
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const audio = new AudioContextClass()
    const gain = audio.createGain()
    const osc = audio.createOscillator()
    const harmony = audio.createOscillator()
    osc.type = 'sine'
    harmony.type = 'triangle'
    osc.frequency.value = emotionFrequency[emotion] || 220
    harmony.frequency.value = (emotionFrequency[emotion] || 220) * 1.5
    gain.gain.value = 0
    osc.connect(gain)
    harmony.connect(gain)
    gain.connect(audio.destination)
    osc.start()
    harmony.start()
    audioRef.current = audio
    oscRef.current = osc
    harmonyRef.current = harmony
    gainRef.current = gain
  }

  const toggleMusic = () => {
    ensureAudio()
    setEnabled((value) => !value)
  }

  useEffect(() => {
    if (!gainRef.current || !audioRef.current) return
    const target = enabled ? volume * (isNarrating ? 0.38 : 1) : 0
    gainRef.current.gain.setTargetAtTime(target, audioRef.current.currentTime, 0.18)
  }, [enabled, volume, isNarrating])

  useEffect(() => {
    if (!oscRef.current || !harmonyRef.current || !audioRef.current) return
    const base = emotionFrequency[emotion] || 220
    oscRef.current.frequency.setTargetAtTime(base, audioRef.current.currentTime, 0.35)
    harmonyRef.current.frequency.setTargetAtTime(base * 1.5, audioRef.current.currentTime, 0.35)
  }, [emotion])

  return { enabled, volume, setVolume, toggleMusic }
}
