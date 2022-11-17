import React, { useState, useEffect } from "react";
import soundfile from "./assets/wav/drum snare.wav";

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [timeStamps, setTimeStamps] = useState<Number[]>([]);
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
    let intervalId;

    if (timeStamps.length === 10) {
      
      let copied = timeStamps.slice();
      intervalId = setInterval(() => {
        if (audioContext && (copied[0] < audioContext.currentTime)) {
          console.log("beats");
          copied.shift();
        }
      }, 1);
    }
    if (timeStamps.length < 1) clearInterval(intervalId);
  }, [timeStamps]);

  // const showText = (array: Number[]) => {
  //   if (audioContext && (array[0] < audioContext.currentTime)) {
  //     console.log("beats");
  //     array.shift();
  //   }
  // }

  const playSound = () => {
    if (audioContext && analyzer) {
      let startTime = audioContext.currentTime + 0.2;
      let array = [];
      let rate = 60 / bpm;

      for (let i = 0; i < 10; i++) {
        array.push(startTime + rate);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        source.start(startTime + rate);
        startTime += rate;
      }
      setTimeStamps(array);
      // console.log(analyzer.fftSize);
      // const bufferLength = analyzer.frequencyBinCount;
      // const dataArray = new Uint8Array(bufferLength);
      // console.log(dataArray.filter(value => value !== 0));
      // analyzer.getByteTimeDomainData(dataArray);
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
