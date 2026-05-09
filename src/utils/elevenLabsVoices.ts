export const elevenLabsVoices = {
  narrator: 'RexqLjNzkCjWogguKyff',
  mother: 'lXiPxoDwq0d2OK7NdaXw',
  maya: 'RwZADRjd8b3vxKTsTtLP',
  jonah: 'atemG3csutMIyK7AbS5c',
  neighbor: 'QtY3JBOUKEB5xzrRfOKc',
}

export function getVoiceId(role: string) {
  const normalized = role.toLowerCase()

  if (normalized.includes('neighbor') || normalized.includes('mrs clarke')) {
    return elevenLabsVoices.neighbor
  }

  if (normalized.includes('mother') || normalized.includes('mom')) {
    return elevenLabsVoices.mother
  }

  if (normalized.includes('maya')) {
    return elevenLabsVoices.maya
  }

  if (normalized.includes('jonah')) {
    return elevenLabsVoices.jonah
  }

  return elevenLabsVoices.narrator
}
