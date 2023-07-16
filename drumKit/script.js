/**
 * ? This code sets up a drumkit machine interface with clickable instrument pads and sound sets.
 * * It allows users to play sounds by clicking on the pads and switch between different sound sets for each instrument.
 * * The code also provides visual effects and a toggle button to show or hide the instrument list.
 * TODO: Add color palettes and a function to change them
 * TODO: Add new sounds
 * TODO: Add sounds for effect buttons
 * TODO: Implement a loading screen with animation and music
 * TODO: Add more instruments
 */

//? get the pads
const drumPads = document.querySelectorAll(".blue");
const guitarPads = document.querySelectorAll(".red");
const pianoPads = document.querySelectorAll(".yellow");
const synthPads = document.querySelectorAll(".green");

//? get the effect buttons
const effectBtns = document.querySelectorAll(".effect");

//? get the buttons to change the sound sets
const drumsBtns = document.querySelectorAll(".drums");
const guitarBtns = document.querySelectorAll(".guitars");
const pianoBtns = document.querySelectorAll(".piano");
const synthBtns = document.querySelectorAll(".synth");

//? create the sounds sets
// * drums
const drumSounds1 = [
  "sounds/Drums/Kick.ogg",
  "sounds/Drums/Snare.ogg",
  "sounds/Drums/Hi-Hat-CLSD.ogg",
];
const drumSounds2 = [
  "sounds/Drums/Hi-Hat-OP.ogg",
  "sounds/Drums/Tom One.ogg",
  "sounds/Drums/Cowbell.ogg",
];
const drumSounds3 = [
  "sounds/Drums/Tom Three L.ogg",
  "sounds/Drums/Crash 1.ogg",
  "sounds/Drums/Floor Tom 1.ogg",
];
const drumSounds4 = [
  "sounds/Drums/Floor Tom 2.ogg",
  "sounds/Drums/Crash 2.ogg",
  "sounds/Drums/Tom Two.ogg",
];
//* guitars notes
const guitarSounds1 = [
  "sounds/Guitar/A.ogg",
  "sounds/Guitar/C.ogg",
  "sounds/Guitar/D.ogg",
];
const guitarSounds2 = [
  "sounds/Guitar/E.ogg",
  "sounds/Guitar/F.ogg",
  "sounds/Guitar/G.ogg",
];
const guitarSounds3 = [
  "sounds/Guitar/A S.ogg",
  "sounds/Guitar/C S.ogg",
  "sounds/Guitar/D S.ogg",
];
const guitarSounds4 = [
  "sounds/Guitar/F S.ogg",
  "sounds/Guitar/G S.ogg",
  "sounds/Guitar/B.ogg",
];
//*piano tiles
const pianoSounds1 = [
  "sounds/Piano/A.ogg",
  "sounds/Piano/B.ogg",
  "sounds/Piano/C.ogg",
];
const pianoSounds2 = [
  "sounds/Piano/D.ogg",
  "sounds/Piano/E.ogg",
  "sounds/Piano/F.ogg",
];
const pianoSounds3 = [
  "sounds/Piano/G.ogg",
  "sounds/Piano/A S.ogg",
  "sounds/Piano/C S.ogg",
];
const pianoSounds4 = [
  "sounds/Piano/D S.ogg",
  "sounds/Piano/F S.ogg",
  "sounds/Piano/G S.ogg",
];
//*synth notes
const synthSounds1 = [
  "sounds/Synth/A.ogg",
  "sounds/Synth/B.ogg",
  "sounds/Synth/C.ogg",
];
const synthSounds2 = [
  "sounds/Synth/D.ogg",
  "sounds/Synth/E.ogg",
  "sounds/Synth/F.ogg",
];
const synthSounds3 = [
  "sounds/Synth/G.ogg",
  "sounds/Synth/A S.ogg",
  "sounds/Synth/C S.ogg",
];
const synthSounds4 = [
  "sounds/Synth/D S.ogg",
  "sounds/Synth/F S.ogg",
  "sounds/Synth/G S.ogg",
];

/**
 * ? this function preload the audios
 * * get the audios from the audioSources array
 */
const preloadAudio = (audioSources) => {
  audioSources.forEach((source) => {
    const audio = new Audio();
    audio.src = source;
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => {
      // * check if the audios are preloaded
      console.log(`the audio  ${source} has been preloaded.`);
    });
  });
};

/**
 * ? call the function preoadAudio
 * * the array contains every sounds sets
 */
preloadAudio([
  ...drumSounds1,
  ...drumSounds2,
  ...drumSounds3,
  ...drumSounds4,
  ...guitarSounds1,
  ...guitarSounds2,
  ...guitarSounds3,
  ...guitarSounds4,
  ...pianoSounds1,
  ...pianoSounds2,
  ...pianoSounds3,
  ...pianoSounds4,
  ...synthSounds1,
  ...synthSounds2,
  ...synthSounds3,
  ...synthSounds4,
]);

// ? global click handlers for the pads
let drumsClickHandler;
let guitarClickHandler;
let pianoClickHandler;
let synthClickHandler;

// ? Function to set the pads
/**
 * @param {array} set - The array contains the sounds of the set
 * * - Declare local variables eg. (drum1, drum2, and drum3)
 * * The clickHandler function plays the sounds of the set
 * * - clickHandler creates a new Audio instance for each pad
 * * - Calls the effectBg function passing the pad type
 * * - effectBg creates a visual effect on the background
 *
 * * For each pad, remove the previous click event listener
 * * Add a new click event listener to each pad with an anonymous function
 * * Call clickHandler to create the sounds for the pads
 */

// ? set the drums pads
const setDrums = (set) => {
  let drum1;
  let drum2;
  let drum3;

  drumsClickHandler = (e, padIndex) => {
    e.preventDefault();
    drum1 = new Audio(set[padIndex]);
    drum1.play();
    drum2 = new Audio(set[padIndex]);
    drum2.play();
    drum3 = new Audio(set[padIndex]);
    drum3.play();
    effectBg("drum");
  };

  drumPads.forEach((drumPad, index) => {
    drumPad.removeEventListener("click", drumsClickHandler);
    drumPad.addEventListener("click", (e) => drumsClickHandler(e, index));
  });
};

// ? set the guitar pads
const setGuitars = (set) => {
  let guitar1;
  let guitar2;
  let guitar3;

  guitarClickHandler = (e, padIndex) => {
    e.preventDefault();
    guitar1 = new Audio(set[padIndex]);
    guitar1.play();
    guitar2 = new Audio(set[padIndex]);
    guitar2.play();
    guitar3 = new Audio(set[padIndex]);
    guitar3.play();
    effectBg("guitar");
  };

  guitarPads.forEach((guitarPad, index) => {
    guitarPad.removeEventListener("click", guitarClickHandler);
    guitarPad.addEventListener("click", (e) => guitarClickHandler(e, index));
  });
};

// ? set the piano pads
const setPiano = (set) => {
  let piano1;
  let piano2;
  let piano3;

  pianoClickHandler = (e, padIndex) => {
    e.preventDefault();
    piano1 = new Audio(set[padIndex]);
    piano1.play();
    piano2 = new Audio(set[padIndex]);
    piano2.play();
    piano3 = new Audio(set[padIndex]);
    piano3.play();
    effectBg("piano");
  };

  pianoPads.forEach((pianoPad, index) => {
    pianoPad.removeEventListener("click", pianoClickHandler);
    pianoPad.addEventListener("click", (e) => pianoClickHandler(e, index));
  });
};

// ? set the synth pads
const setSynth = (set) => {
  let synth1;
  let synth2;
  let synth3;

  synthClickHandler = (e, padIndex) => {
    e.preventDefault();
    synth1 = new Audio(set[padIndex]);
    synth1.play();
    synth2 = new Audio(set[padIndex]);
    synth2.play();
    synth3 = new Audio(set[padIndex]);
    synth3.play();
    effectBg("synth");
  };

  synthPads.forEach((synthPad, index) => {
    synthPad.removeEventListener("click", synthClickHandler);
    synthPad.addEventListener("click", (e) => synthClickHandler(e, index));
  });
};

// ? Event listener setup for set buttons
/**
 * * For each button, add a click event listener
 * * - Prevent the default behavior of the click event
 * * - Get the set number from the text content of the clicked button
 * * - Based on the set number, call the respective set function with the corresponding sounds set
 * * - Call the lumine function to apply a visual effect to the pads
 */

// ? drum set buttons
drumsBtns.forEach((drumsBtn) => {
  drumsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setNumber = drumsBtn.textContent;
    switch (setNumber) {
      case "1":
        setDrums(drumSounds1);
        break;
      case "2":
        setDrums(drumSounds2);
        break;
      case "3":
        setDrums(drumSounds3);
        break;
      case "4":
        setDrums(drumSounds4);
        break;
    }
    lumine(drumPads);
  });
});

// ? guitar set buttons
guitarBtns.forEach((guitarBtn) => {
  guitarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setNumber = guitarBtn.textContent;
    switch (setNumber) {
      case "1":
        setGuitars(guitarSounds1);
        break;
      case "2":
        setGuitars(guitarSounds2);
        break;
      case "3":
        setGuitars(guitarSounds3);
        break;
      case "4":
        setGuitars(guitarSounds4);
        break;
    }
    lumine(guitarPads);
  });
});

//? piano set buttons
pianoBtns.forEach((pianoBtn) => {
  pianoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setNumber = pianoBtn.textContent;
    switch (setNumber) {
      case "1":
        setPiano(pianoSounds1);
        break;
      case "2":
        setPiano(pianoSounds2);
        break;
      case "3":
        setPiano(pianoSounds3);
        break;
      case "4":
        setPiano(pianoSounds4);
        break;
    }
    lumine(pianoPads);
  });
});

// ? synth set buttons
synthBtns.forEach((synthBtn) => {
  synthBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setNumber = synthBtn.textContent;
    switch (setNumber) {
      case "1":
        setSynth(synthSounds1);
        break;
      case "2":
        setSynth(synthSounds2);
        break;
      case "3":
        setSynth(synthSounds3);
        break;
      case "4":
        setSynth(synthSounds4);
        break;
    }
    lumine(synthPads);
  });
});

// ! set the default sets for every instrument
setDrums(drumSounds1);
setGuitars(guitarSounds1);
setPiano(pianoSounds1);
setSynth(synthSounds1);

// ? Instrument toggler setup
/**
 * * Get the instrument toggler button element and instrument list element from the DOM
 */

const instrumentTogglerBtn = document.querySelector(".instruments-toggle");
const instrumentList = document.querySelector(".instruments");

/**
 * * Add a click event listener to the instrument toggler button
 * * - Prevent the default behavior of the click event
 * * - Check the current display style of the instrument list
 * *- If the display style is "grid", hide the instrument list and update the toggler button text
 * * - If the display style is not "grid", show the instrument list and update the toggler button text
 */

instrumentTogglerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (instrumentList.style.display === "grid") {
    instrumentList.style.display = "none";
    instrumentTogglerBtn.textContent = "Show Instruments";
  } else {
    instrumentList.style.display = "grid";
    instrumentTogglerBtn.textContent = "Hide Instruments";
  }
});

// ? Lumine function
/**
 * * Apply a temporary visual effect to the given pads
 * * - Add the "br" class to each pad, triggering the effect
 * * - After a delay of 1000 milliseconds, remove the "br" class from the pads
 *
 * * - Remove event listeners from the pads after a brief delay
 * * - Specifically, remove event listeners for the drums, guitar, piano, and synth pads
 * * - These event listeners are associated with the respective click handlers
 */

const lumine = (padE) => {
  padE.forEach((pade) => {
    pade.classList.add("br");
    setTimeout(() => {
      pade.classList.remove("br");
    }, 1000);
  });

  // * eliminate the event listeners
  setTimeout(() => {
    padE.forEach((pade) => {
      pade.removeEventListener("click", drumsClickHandler);
      pade.removeEventListener("click", guitarClickHandler);
      pade.removeEventListener("click", pianoClickHandler);
      pade.removeEventListener("click", synthClickHandler);
    });
  }, 100);
};

// ? EffectBg function
/**
 * * Apply a background color effect to the body element based on the given instrument type
 * * - Determine the background color based on the instrument type (drum, guitar, piano, synth)
 * * - Add the corresponding color class to the body element
 * * - After a delay of 500 milliseconds, remove the color class from the body element
 */

const bg = document.getElementsByTagName("body")[0];

const effectBg = (inst) => {
  var bgColor;

  if (inst == "drum") {
    bgColor = "blue";
  } else if (inst == "guitar") {
    bgColor = "red";
  } else if (inst == "piano") {
    bgColor = "yellow";
  } else if (inst == "synth") {
    bgColor = "green";
  }

  bg.classList.add(bgColor);
  setTimeout(() => {
    bg.classList.remove(bgColor);
  }, 500);
};
