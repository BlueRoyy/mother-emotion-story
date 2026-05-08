type LearningPanelProps = { emotion: string; brainAreas: string[]; sceneTitle: string }

const prompts: Record<string, string[]> = {
  Fear: ['What could the children do next that would be honest and safe?', 'How can fear make it harder to tell the truth?'],
  'Suspicion and Worry': ['Why might a parent become worried when something sounds wrong?', 'What is one brave way to tell the truth?'],
  'Alarm and Urgency': ['What should adults do first when a child may be hurt?', 'How can urgent feelings help protect someone?'],
  'Sadness and Relief': ['Why can someone cry even after things are getting better?', 'What does forgiveness sound like in this scene?'],
  'Peace and Restored Love': ['What did this family learn?', 'How can consequences and love happen at the same time?'],
}

export function LearningPanel({ emotion, brainAreas, sceneTitle }: LearningPanelProps) {
  const questions = prompts[emotion] || ['What choice helped or hurt the family in this scene?', 'What emotion is the mother feeling, and why?']

  return (
    <section className="learning-panel">
      <div className="learning-header">
        <span>Emotional Learning Mode</span>
        <strong>{sceneTitle}</strong>
      </div>
      <p>The mother is experiencing <strong>{emotion}</strong>. The app is highlighting {brainAreas.join(', ')} to show one part of how emotions and decisions can work together.</p>
      <div className="reflection-grid">
        {questions.map((question) => <div className="reflection-card" key={question}>{question}</div>)}
      </div>
    </section>
  )
}
