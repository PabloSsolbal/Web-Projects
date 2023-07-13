const drumPads = document.querySelectorAll(".blue");
const guitarPads = document.querySelectorAll(".red");
const pianoPads = document.querySelectorAll(".yellow");
const synthPads = document.querySelectorAll(".green");

const effectBtns = document.querySelectorAll(".effect");

const instrument = document.querySelectorAll(".instrument");

const drumSounds = [
  { drum1: "sounds/Drums/Kick.ogg" },
  { drum2: "sounds/Drums/Snare.ogg" },
  { drum3: "sounds/Drums/Hi-Hat_CLSD.ogg" },
  { drum4: "sounds/Drums/Hi-Hat_OP.ogg" },
  { drum5: "sounds/Drums/Tom 1 (L).ogg" },
  { drum6: "sounds/Drums/Cowbell.ogg" },
  { drum7: "sounds/Drums/Tom 3 (L).ogg" },
  { drum8: "sounds/Drums/Crash 1.ogg" },
  { drum9: "sounds/Drums/Floor Tom 1.ogg" },
  { drum10: "sounds/Drums/Floor Tom 2.ogg" },
  { drum11: "sounds/Drums/Crash 2.ogg" },
  { drum12: "sounds/Drums/Tom 2.ogg" },
];
const guitarSounds = [
  { guitar1: "sounds/Guitar/A.ogg" },
  { guitar2: "sounds/Guitar/C.ogg" },
  { guitar3: "sounds/Guitar/D.ogg" },
  { guitar4: "sounds/Guitar/E.ogg" },
  { guitar5: "sounds/Guitar/F.ogg" },
  { guitar6: "sounds/Guitar/G.ogg" },
  { guitar7: "sounds/Guitar/A#.ogg" },
  { guitar8: "sounds/Guitar/C#.ogg" },
  { guitar9: "sounds/Guitar/D#.ogg" },
  { guitar10: "sounds/Guitar/F#.ogg" },
  { guitar11: "sounds/Guitar/G#.ogg" },
  { guitar12: "sounds/Guitar/B.ogg" },
];
const pianoSounds = [
  { piano1: "sounds/Piano/A.ogg" },
  { piano2: "sounds/Piano/B.ogg" },
  { piano3: "sounds/Piano/C.ogg" },
  { piano4: "sounds/Piano/D.ogg" },
  { piano5: "sounds/Piano/E.ogg" },
  { piano6: "sounds/Piano/F.ogg" },
  { piano7: "sounds/Piano/G.ogg" },
  { piano8: "sounds/Piano/A#.ogg" },
  { piano9: "sounds/Piano/C#.ogg" },
  { piano10: "sounds/Piano/D#.ogg" },
  { piano11: "sounds/Piano/F#.ogg" },
  { piano12: "sounds/Piano/G#.ogg" },
];
const synthSounds = [
  { synth1: "sounds/Synth/A.ogg" },
  { synth2: "sounds/Synth/B.ogg" },
  { synth3: "sounds/Synth/C.ogg" },
  { synth4: "sounds/Synth/D.ogg" },
  { synth5: "sounds/Synth/E.ogg" },
  { synth6: "sounds/Synth/F.ogg" },
  { synth7: "sounds/Synth/G.ogg" },
  { synth8: "sounds/Synth/A#.ogg" },
  { synth9: "sounds/Synth/C#.ogg" },
  { synth10: "sounds/Synth/D#.ogg" },
  { synth11: "sounds/Synth/F#.ogg" },
  { synth12: "sounds/Synth/G#.ogg" },
];

class Set {
  constructor(sound1, sound2, sound3) {
    this.sound1 = new Audio(sound1);
    this.sound2 = new Audio(sound2);
    this.sound3 = new Audio(sound3);
  }
  play() {
    this.sound1.play();
    this.sound2.play();
    this.sound3.play();
  }
}

const createSets = (instrumentSounds) => {
  const sets = [];

  for (let i = 0; i < instrumentSounds.length; i += 3) {
    const sound1 = Object.values(instrumentSounds[i])[0];
    const sound2 = Object.values(instrumentSounds[i + 1])[0];
    const sound3 = Object.values(instrumentSounds[i + 2])[0];

    const set = new Set(sound1, sound2, sound3);
    sets.push(set);
  }

  return sets;
};

const drumSets = createSets(drumSounds);
const guitarSets = createSets(guitarSounds);
const pianoSets = createSets(pianoSounds);
const synthSets = createSets(synthSounds);

const setDrums = () => {
  drumPads.forEach((drumPad, index) => {
    drumPad.addEventListener("click", () => {
      drumSets[index].play();
    });
  });
};

const setGuitars = () => {
  guitarPads.forEach((guitarPad, index) => {
    guitarPad.addEventListener("click", () => {
      guitarSets[index].play();
    });
  });
};

const setPiano = () => {
  pianoPads.forEach((pianoPad, index) => {
    pianoPad.addEventListener("click", () => {
      pianoSets[index].play();
    });
  });
};

const setSynth = () => {
  synthPads.forEach((synthPad, index) => {
    synthPad.addEventListener("click", () => {
      synthSets[index].play();
    });
  });
};

setDrums();
setGuitars();
setPiano();
setSynth();

const instrumentTogglerBtn = document.querySelector(".instruments-toggle");
const instrumentList = document.querySelector(".instruments");

instrumentTogglerBtn.addEventListener("click", () => {
  if (instrumentList.style.display === "grid") {
    instrumentList.style.display = "none";
    instrumentTogglerBtn.textContent = "Show Instruments";
  } else {
    instrumentList.style.display = "grid";
    instrumentTogglerBtn.textContent = "Hide Instruments";
  }
});
