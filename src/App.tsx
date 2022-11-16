import React, { useState, useEffect } from "react";
import soundfile from "./assets/wav/drum snare.wav";

function App() {
  //const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);

  useEffect(() => {
    if (audioContext) {
      const audio = new Audio(soundfile);
      fetch(audio.src)
        .then((res) => res.arrayBuffer())
        .then((buffer) => audioContext.decodeAudioData(buffer))
        .then((buffer) => {
          const track = audioContext.createBufferSource();
          track.buffer = buffer;
          track.connect(audioContext.destination);
          track.start(0);
        });
    }
  }, [audioContext]);

  const handlePlayClick = () => {
    if (!audioContext) setAudioContext(new AudioContext());
  };

  return (
    <div className="App">
      <button onClick={handlePlayClick}>Play</button>
      <button>Stop</button>
    </div>
  );
}

export default App;
