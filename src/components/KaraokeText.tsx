type KaraokeTextProps = {
  text: string
  activeWordIndex: number
}

export function KaraokeText({ text, activeWordIndex }: KaraokeTextProps) {
  const words = text.split(' ')

  return (
    <div className="story-text" aria-live="polite">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={index <= activeWordIndex ? 'word active' : 'word'}
        >
          {word}{' '}
        </span>
      ))}
    </div>
  )
}
