type LearningPanelProps = { emotion: string; brainAreas: string[]; sceneTitle: string }

const prompts: Record<string, string[]> = {
  Fear: ['What honest and safe choice could the children make next?', 'How can fear make truth-telling harder?'],
  'Suspicion and Worry': ['Why might Mom become worried when something sounds wrong?', 'What brave words could Maya use now?'],
  'Alarm and Urgency': ['What should an adult do first when a child may be hurt?', 'How can urgent feelings help protect someone?'],
  'Sadness and Relief': ['Why can someone cry even when things are getting better?', 'What does forgiveness sound like here?'],
  'Peace and Restored Love': ['What did this family learn?', 'How can consequences and love happen at the same time?'],
}

export function LearningPanel({ emotion, brainAreas, sceneTitle }: LearningPanelProps) {
  const questions = prompts[emotion] || ['What choice helped or hurt the family?', 'What emotion is Mom feeling, and why?']
  return (
    <section className="learning-panel">
      <div className="learning-header">
        <span>Emotional Learning</span>
        <strong>{sceneTitle}</strong>
      </div>
      <p className="learning-summary">Mom is feeling <strong>{emotion}</strong>. Highlighted brain area: <strong>{brainAreas.join(', ')}</strong>.</p>
      <div className="reflection-grid">
        {questions.map((question) => <div className="reflection-card" key={question}>{question}</div>)}
      </div>
    </section>
  )
}
