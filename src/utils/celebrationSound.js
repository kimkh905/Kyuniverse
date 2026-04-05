import { Audio } from 'expo-av';

let activeSound = null;

export async function playCelebrationSound() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    if (activeSound) {
      await activeSound.unloadAsync();
      activeSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/celebration.wav'),
      { shouldPlay: true, volume: 0.45 }
    );

    activeSound = sound;

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (!status.isLoaded || !status.didJustFinish) {
        return;
      }

      await sound.unloadAsync();

      if (activeSound === sound) {
        activeSound = null;
      }
    });
  } catch (error) {
    console.warn('Failed to play celebration sound', error);
  }
}
