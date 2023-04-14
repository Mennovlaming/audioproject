var rotateElement = document.querySelector('.rotate');
var currentRotation = 0;
var animationSpeed = 1;
 
const bpm25 = document.querySelector('#bpm25 img');
const bpm50 = document.querySelector('#bpm50 img');
const bpm100 = document.querySelector('#bpm100 img');

bpm25.addEventListener("click", function(){
  bpm25.src = "./images/knopgroen.png";
  bpm50.src = "./images/knoppatroon.png";
  bpm100.src = "./images/knoppatroon.png";
});

bpm50.addEventListener("click", function(){
  bpm50.src = "./images/knopgroen.png";
  bpm100.src = "./images/knoppatroon.png";
  bpm25.src = "./images/knoppatroon.png"
});

bpm100.addEventListener("click", function(){
  bpm100.src = "./images/knopgroen.png";
  bpm25.src = "./images/knoppatroon.png";
  bpm50.src = "./images/knoppatroon.png";
});

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

// Initialize variables
let bpm = 50;
let interval;
let timeoutIds = [];
let isPlayingArray = [false, false, false, false, false, false];

// Get DOM elements
const bpmButtons = document.querySelectorAll(".changeBPM button");
const soundButtons = document.querySelectorAll(".sound");

// Function to play a note with duration and interval
function playNoteWithDurationAndInterval(duration, synthIndex) {
  synths[synthIndex].triggerAttackRelease("C4", duration);
  timeoutIds[synthIndex] = setTimeout(() => {
    playNoteWithDurationAndInterval(duration, synthIndex);
  }, interval);
}

// Function to toggle sound on/off
function toggleSound(synthIndex) {
  if (isPlayingArray[synthIndex]) {
    clearTimeout(timeoutIds[synthIndex]);
    isPlayingArray[synthIndex] = false;
  } else {
    playNoteWithDurationAndInterval("8n", synthIndex);
    isPlayingArray[synthIndex] = true;
  }
  soundButtons[synthIndex].classList.toggle("active");
}

// Add click event listener to sound buttons
for (let i = 0; i < soundButtons.length; i++) {
  soundButtons[i].addEventListener("click", () => {
    toggleSound(i);
  });
}

// Function to update bpm and stop all active sounds
function updateBPM(newBPM) {
  // Stop all active sounds
  for (let i = 0; i < timeoutIds.length; i++) {
    if (isPlayingArray[i]) {
      clearTimeout(timeoutIds[i]);
      isPlayingArray[i] = false;
      soundButtons[i].classList.remove("active");
    }
  }

  // Update bpm and restart beat if necessary
  clearInterval(interval);
  bpm = newBPM;
  interval = 60000 / bpm / 2;
  for (let i = 0; i < timeoutIds.length; i++) {
    if (isPlayingArray[i]) {
      playNoteWithDurationAndInterval("8n", i);
    }
  }

  // Remove activeBPM class from all buttons
  bpmButtons.forEach((button) => {
    button.classList.remove("activeBPM");
  });

  // Add activeBPM class to active button
  bpmButtons.forEach((button) => {
    if (parseInt(button.innerHTML) === newBPM) {
      button.classList.add("activeBPM");
    }
  });
}

// Add click event listener to bpm buttons
for (let i = 0; i < bpmButtons.length; i++) {
  bpmButtons[i].addEventListener("click", () => {
    const newBPM = parseInt(bpmButtons[i].innerHTML);
    updateBPM(newBPM);
  });
}

// Set default bpm to 50
updateBPM(bpm);