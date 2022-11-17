import React, { useState, useEffect } from "react";
import soundfile from "./assets/wav/drum snare.wav";

interface Node {
  source: AudioBufferSourceNode;
  time: Number;
}

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [sourceDetails, setSourceDetails] = useState<Node[]>([]);
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [bpm, setBpm] = useState(120);

  const audio = new Audio(soundfile);

  useEffect(() => {
    if (audioContext) createAndSetBuffer(audio);
  }, [audioContext]);

  useEffect(() => {
    playSound();
  }, [audioBuffer, analyzer]);

  useEffect(() => {
    let copied = sourceDetails.slice();
    let text = "beat";
    let intervalId = setInterval(() => {
      
      if (audioContext && copied[0] && copied[0].time < audioContext.currentTime) {
        console.log(text);
        text += "s";
        copied.shift();
        if (copied.length < 1) clearInterval(intervalId);
      }
    }, 0);

    return () => clearInterval(intervalId);

  }, [sourceDetails]);

  const playSound = () => {
    if (audioContext && analyzer) {
      let startTime = audioContext.currentTime + 0.2;
      let array = [];
      let rate = 60 / bpm;

      for (let i = 0; i < 10; i++) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        array.push({ source: source, time: startTime + rate });
        source.start(startTime + rate);
        startTime += rate;
      }
      setSourceDetails(array);
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
    const context = new AudioContext();
    setAudioContext(context);
    const analyzer = context.createAnalyser();
    setAnalyzer(analyzer);
  };

  const handlePlayClick = () => {
    if (bpm < 60 || bpm > 200) {
      const input = document.querySelector("input");
      input && input.reportValidity();
      return;
    }
    if (!audioContext) initialPlay();
    else if (!isPlaying) playSound();
  };

  const handleStopClick = () => {
    setIsPlaying(false);
    const copiedSourceDetails = sourceDetails.slice();
    copiedSourceDetails.forEach((obj) => obj.source.stop());
    setSourceDetails([]);
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let num = parseInt(event.target.value, 10);
    if (isNaN(num)) return setBpm(0);

    if (num < 60 || num > 200) {
      event.target.reportValidity();
    }
    setBpm(num);
  };

  return (
    <div className="App">
      <h1 id="text">Drop the Beat</h1>
      <p>Open the console to see the beats!</p>
      BPM (limit 60 - 200): <input
        type="number"
        min={60}
        max={200}
        value={bpm.toString()}
        onChange={handleBpmChange}
      /><br />
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handleStopClick}>Stop</button>
      
    </div>
  );
}

export default App;

// Failed to execute 'start' on 'AudioBufferSourceNode': cannot call start more than once.
