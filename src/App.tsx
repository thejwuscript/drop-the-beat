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
    let intervalId: ReturnType<typeof setInterval>;
    let copied: Node[] = [];

    if (sourceDetails.length === 10) {
      copied = sourceDetails.slice();
      intervalId = setInterval(() => {
        if (audioContext && copied[0].time < audioContext.currentTime) {
          console.log("beats");
          copied.shift();
          if (copied.length < 1) clearInterval(intervalId);
        }
      }, 0);
    }
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
    if (!audioContext) initialPlay();
    else if (!isPlaying) playSound();
  };

  const handleStopClick = () => {
    setIsPlaying(false);
    const copiedSourceDetails = sourceDetails.slice();
    copiedSourceDetails.forEach(obj => obj.source.stop());
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(event.target.value));
  };

  return (
    <div className="App">
      <input
        type="number"
        min={60}
        max={200}
        value={bpm}
        onChange={handleBpmChange}
      />
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handleStopClick}>Stop</button>
      <p id="text">Drop the Beat</p>
    </div>
  );
}

export default App;

// Failed to execute 'start' on 'AudioBufferSourceNode': cannot call start more than once.
