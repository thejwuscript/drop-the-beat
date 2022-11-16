import React, { useState, useEffect } from "react";
import soundfile from "./assets/wav/drum snare.wav";

function App() {
  //const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const audio = new Audio(soundfile);

  useEffect(() => {
    if (audioContext) createAndSetBuffer(audio);
  }, [audioContext]);

  useEffect(() => {
    playSound();
  }, [audioBuffer])

  const playSound = () => {
    if (audioContext) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.loop = true;
      source.start(0);

      setSource(source);
    }
  };

  const createAndSetBuffer = (element: HTMLAudioElement) => {
    if (audioContext)
      fetch(element.src)
        .then((res) => res.arrayBuffer())
        .then((buffer) => audioContext.decodeAudioData(buffer))
        .then((buffer) => setAudioBuffer(buffer));
  };

  const initialPlay = () => {
    setAudioContext(new AudioContext());
  };

  const handlePlayClick = () => {
    if (!audioContext) initialPlay();
    else if (!isPlaying) playSound();
  };

  const handleStopClick = () => {
    if (source) source.stop();
    setIsPlaying(false);
  };

  return (
    <div className="App">
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handleStopClick}>Stop</button>
    </div>
  );
}

export default App;

// Failed to execute 'start' on 'AudioBufferSourceNode': cannot call start more than once.
