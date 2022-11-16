import React from 'react';
import soundfile from "./assets/wav/drum snare.wav";

function App() {
  // const audioContext = new AudioContext();
  // const audioElement = document.querySelector("audio")!;
  // const track = audioContext.createMediaElementSource(audioElement);

  return (
    <div className="App">
      <audio controls src={soundfile}></audio>
      <button data-playing="false" role="switch" aria-checked="false">
        <span>Play/Pause</span>
      </button>
    </div>
  );
}

export default App;
