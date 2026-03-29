import * as Speech from 'expo-speech';

export function speakText(text, language = 'en-US') {
  Speech.stop();
  Speech.speak(text, {
    language,
    rate: 0.92,
    pitch: 1.0,
  });
}
