export type VoiceRole = 'narrator' | 'mother' | 'maya' | 'jonah' | 'neighbor'

export type VoiceSegment = {
  role: VoiceRole
  text: string
}

export const voiceProfiles: Record<VoiceRole, { rate: number; pitch: number; preferredVoiceTerms: string[] }> = {
  narrator: { rate: 0.86, pitch: 1.08, preferredVoiceTerms: ['Microsoft Guy', 'Google UK English Male', 'Aaron', 'Daniel', 'Alex', 'Microsoft David'] },
  mother: { rate: 0.86, pitch: 1.02, preferredVoiceTerms: ['Samantha', 'Microsoft Zira', 'Google UK English Female', 'Karen'] },
  maya: { rate: 0.96, pitch: 1.28, preferredVoiceTerms: ['Samantha', 'Google US English', 'Microsoft Zira'] },
  jonah: { rate: 0.98, pitch: 1.18, preferredVoiceTerms: ['Alex', 'Google US English', 'Microsoft David'] },
  neighbor: { rate: 0.9, pitch: 1.0, preferredVoiceTerms: ['Samantha', 'Karen', 'Google UK English Female'] },
}

export function pickVoice(role: VoiceRole): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const profile = voiceProfiles[role]

  for (const term of profile.preferredVoiceTerms) {
    const voice = voices.find((item) => item.name.includes(term))
    if (voice) return voice
  }

  return voices.find((voice) => voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('compact')) || voices.find((voice) => voice.lang.startsWith('en'))
}

export function getVoiceSegments(title: string, fallbackText: string): VoiceSegment[] {
  const scenes: Record<string, VoiceSegment[]> = {
    'Grounded, But Loved': [
      { role: 'narrator', text: 'Maya and Jonah sat quietly at the kitchen table. They had been grounded because they had disobeyed their mother the day before. Mom stood beside them, not angry, but serious.' },
      { role: 'mother', text: 'I love you both, but love also means helping you learn to make better choices.' },
    ],
    'The Instructions': [
      { role: 'narrator', text: 'Before leaving for work, Mom gave clear instructions.' },
      { role: 'mother', text: 'Please stay inside, finish your reading, eat the lunch I packed, and do not go into the backyard until I come home.' },
      { role: 'narrator', text: 'Maya and Jonah nodded and promised to obey.' },
    ],
    Temptation: [
      { role: 'narrator', text: 'After Mom left, the house felt quiet. Maya opened her reading book, but Jonah looked through the window.' },
      { role: 'jonah', text: 'The ball is still outside.' },
      { role: 'narrator', text: 'He whispered. Maya frowned because Mom had said not to go outside.' },
    ],
    Disobedience: [
      { role: 'narrator', text: 'The children opened the back door and stepped outside. At first everything felt fun. They kicked the ball, laughed, and forgot they were grounded. But the grass near the mango tree was still wet from last night’s rain.' },
    ],
    'The Accident': [
      { role: 'narrator', text: 'Jonah ran after the ball. His foot slipped on the wet grass. He fell hard and cried out. Maya froze. Jonah held his arm and tears rolled down his cheeks.' },
      { role: 'jonah', text: 'Do not tell Mom.' },
      { role: 'narrator', text: 'Maya’s heart beat fast.' },
    ],
    'The Lie': [
      { role: 'narrator', text: 'Maya called Mom at work.' },
      { role: 'maya', text: 'Everything is okay.' },
      { role: 'narrator', text: 'Maya said, trying to sound normal. But Mom heard Jonah crying in the background.' },
      { role: 'mother', text: 'Maya, what happened?' },
      { role: 'narrator', text: 'Mom said slowly. Maya swallowed and said Jonah only bumped his toe.' },
    ],
    'Mother Finds Out': [
      { role: 'narrator', text: 'Just then, Mrs Clarke from next door called Mom too.' },
      { role: 'neighbor', text: 'I saw the children outside. Jonah fell near the mango tree.' },
      { role: 'narrator', text: 'Mom’s eyes filled with fear. She grabbed her bag and hurried home because all she could think was, my babies need me.' },
    ],
    'Running to Her Children': [
      { role: 'narrator', text: 'Mom reached the house and ran to the backyard. When she saw Jonah crying and Maya trembling, she dropped to her knees.' },
      { role: 'mother', text: 'I am here.' },
      { role: 'narrator', text: 'She whispered. She wrapped both children in her arms and held them close.' },
    ],
    Forgiveness: [
      { role: 'maya', text: 'Mom, we disobeyed.' },
      { role: 'narrator', text: 'Maya cried.' },
      { role: 'jonah', text: 'And we lied.' },
      { role: 'narrator', text: 'Jonah whispered. Mom’s tears fell as she held them close.' },
      { role: 'mother', text: 'I was afraid because I love you so much. Thank you for telling the truth now.' },
    ],
    Reconciliation: [
      { role: 'narrator', text: 'Later that evening, Jonah’s arm was checked and bandaged. The family sat together on the couch.' },
      { role: 'mother', text: 'Forgiveness does not mean there are no consequences, but it does mean love is still here.' },
      { role: 'narrator', text: 'Maya and Jonah hugged her tightly, and the family was whole again.' },
    ],
  }

  return scenes[title] || [{ role: 'narrator', text: fallbackText }]
}
