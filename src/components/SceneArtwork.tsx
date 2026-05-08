type SceneArtworkProps = { title: string; icon: string; illustration: string; gradient: string; image?: string }

export function SceneArtwork({ title, icon, illustration, gradient, image }: SceneArtworkProps) {
  return (
    <div className="scene-art fade-in" style={{ background: image ? undefined : gradient }}>
      {image && <img className="photo-scene" src={image} alt={title} />}
      <div className="photo-overlay" />
      {!image && <div className="art-icon">{icon}</div>}
      <div className="art-caption">{illustration}</div>
    </div>
  )
}
