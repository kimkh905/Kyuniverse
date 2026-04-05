function toPhrase(english) {
  return String(english ?? '').replace(/^to\s+/i, '').trim();
}

export function getExampleSentence(card) {
  const phrase = toPhrase(card.english);
  const lowerPhrase = phrase.charAt(0).toLowerCase() + phrase.slice(1);

  if (card.partOfSpeech === 'Verb') {
    return {
      sentence: `I want to ${lowerPhrase} a little more every day.`,
      hint: `Say the Korean word when you read "${phrase}".`,
    };
  }

  if (card.partOfSpeech === 'Adjective') {
    return {
      sentence: `This feels ${lowerPhrase} today.`,
      hint: `Try replacing "${lowerPhrase}" with the Korean word out loud.`,
    };
  }

  if (card.partOfSpeech === 'Adverb') {
    return {
      sentence: `Please say it ${lowerPhrase} so I can follow along.`,
      hint: `Use the Korean word when you practice the sentence again.`,
    };
  }

  return {
    sentence: `I noticed this ${lowerPhrase} during my day.`,
    hint: `Point to the idea and say the Korean word once more.`,
  };
}
