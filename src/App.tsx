import React, { useState, useEffect } from "react";
import soundfile from "./assets/wav/drum snare.wav";

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [bpm, setBpm] = useState(0);

  const audio = new Audio(soundfile);

  useEffect(() => {
    if (audioContext) createAndSetBuffer(audio);
  }, [audioContext]);

  useEffect(() => {
    playSound();
  }, [audioBuffer])

  const playSound = () => {
    if (audioContext) {
      let startTime = audioContext.currentTime + 1;
      let array = [];

      for (let i = 0; i < 20; i++) {
        array.push(startTime + 0.8);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(startTime + 0.8);
        startTime += 0.8;
      }

      let testStr = "beat";

      while (array.length > 0) {
        const nextTime = array[0];
        if (nextTime < audioContext.currentTime) {
          console.log(testStr);
          testStr += "s";
          array.shift();
        }
      }
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

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(event.target.value));
  }

  return (
    <div className="App">
      <input type="number" min={60} max={200} value={bpm} onChange={handleBpmChange} />
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handleStopClick}>Stop</button>
    </div>
  );
}

export default App;

// Failed to execute 'start' on 'AudioBufferSourceNode': cannot call start more than once.
