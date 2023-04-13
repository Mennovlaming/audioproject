var rotateElement = document.querySelector('.rotate');
var currentRotation = 0;
var animationSpeed = 1;
const buttons = document.querySelectorAll(".sound");

setInterval(function() {
  // add a small rotation angle to the current rotation angle
  currentRotation += animationSpeed;
  rotateElement.style.transform = 'translate(-50%, -50%) rotate(' + currentRotation + 'deg)';
}, 50); // rotate the element every 50 milliseconds (adjust this value to change the speed)

document.getElementById('speed-up').addEventListener('click', function() {
  // increase the animation speed by 1 degree per frame
  animationSpeed += 1;
});

document.getElementById('slow-down').addEventListener('click', function() {
  // decrease the animation speed by 1 degree per frame
  animationSpeed -= 1;
});

const synths = [
  new Tone.PolySynth({
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.2,
      decay: 0.5,
      sustain: 0.2,
      release: 1,
    },
  }).toDestination(),
  new Tone.Synth({
    oscillator: {
      type: "triangle",
      modulationType: "sawtooth",
      modulationIndex: 1,
      harmonicity: 1,
    },
    envelope: {
      attack: 0.2,
      decay: 0.4,
      sustain: 0.3,
      release: 0.8,
    },
  }).toDestination(),
  new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 4,
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.001,
      decay: 0.5,
      sustain: 0,
      release: 1,
    },
  }).toDestination(),
  new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.1,
    },
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination(),
  new Tone.FMSynth({
    harmonicity: 2,
    modulationIndex: 10,
    detune: 0,
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
    modulation: {
      type: "square",
    },
    modulationEnvelope: {
      attack: 0.002,
      decay: 0.2,
      sustain: 0.3,
      release: 0.1,
    },
  }).toDestination(),
  new Tone.AMSynth({
    harmonicity: 3,
    detune: 0,
    oscillator: {
      type: "square",
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 1,
    },
    modulation: {
      type: "sawtooth",
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 0.5,
    },
  }).toDestination(),
];


let intervalIds = [null, null, null, null, null, null];
let isPlayingArray = [false, false, false, false, false, false];

function playNoteWithDurationAndInterval(duration, interval, synthIndex) {
  synths[synthIndex].triggerAttackRelease("C4", duration);
  intervalIds[synthIndex] = setTimeout(() => {
    playNoteWithDurationAndInterval(duration, interval, synthIndex);
  }, interval);
}

function toggleSound(synthIndex) {
  if (isPlayingArray[synthIndex]) {
    clearInterval(intervalIds[synthIndex]);
    isPlayingArray[synthIndex] = false;
  } else {
    playNoteWithDurationAndInterval("8n", 1000, synthIndex);
    isPlayingArray[synthIndex] = true;
  }
  buttons[synthIndex].classList.toggle("active");
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", () => {
    toggleSound(i);
  });
}