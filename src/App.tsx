import React, { useState, useEffect } from "react";
import soundfile from "./assets/wav/drum snare.wav";

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [timers, setTimers] = useState<Number[]>([]);
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [bpm, setBpm] = useState(120);

  const audio = new Audio(soundfile);

  useEffect(() => {
    if (audioContext) createAndSetBuffer(audio);
  }, [audioContext]);

  useEffect(() => {
    playSound();
  }, [audioBuffer])

  useEffect(() => {
    let testStr = "beat";
    let copied = timers.slice();
    if (audioContext) {
      while (copied.length > 0) {
        const nextTime = copied[0];
        if (nextTime < audioContext.currentTime) {
          console.log(testStr);
          testStr += "s";
          copied.shift();
        }
      }
    }
  }, [timers])

  const playSound = () => {
    if (audioContext) {
      let startTime = audioContext.currentTime + 0.2;
      let array = [];
      let rate = 60 / bpm;

      for (let i = 0; i < 10; i++) {
        array.push(startTime + rate);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(startTime + rate);
        startTime += rate;
      };

      setTimers(array); 
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
    setTimers([]);
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
