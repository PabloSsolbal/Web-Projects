let $screen = document.querySelector(".Screen");
let $select = document.querySelector(".Select");
let $start = document.querySelector(".Start");

let $leftArrow = document.querySelector(".Left");
let $rightArrow = document.querySelector(".Right");

let $closeBtn = document.querySelector(".DontRememberClose");
let $gotItBtn = document.querySelector(".CloseAndRemember");

let url = "https://pokeapi.co/api/v2/pokemon/";

let pkmnObject = {
  id: "",
  name: "",
  height: "",
  weight: "",
  types: [],
  moves: [],
  stats: {},
  abilities: [],
  evolutionLines: {},
};

const Capitalizer = (string) => {
  const capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalizedString;
};

const NumberFormater = (number) => {
  if (number < 10) {
    return "#00" + number;
  } else if (number < 100) {
    return "#0" + number;
  } else {
    return "#" + number;
  }
};

const createLoader = () => {
  const $loader = document.createElement("div");
  $loader.classList.add("Loader");
  $loader.classList.add("Center");

  const $loaderContent = document.createElement("div");
  $loaderContent.classList.add("LoaderContent");
  $loaderContent.classList.add("Center");

  $loader.innerHTML = `<img src="assets/pokeball.png" class="PokeballLoader" alt="pokeball loader">`;

  $loader.appendChild($loaderContent);
  $screen.appendChild($loader);
};

async function getEvoChain(name) {
  try {
    let nm = name.split("-");
    let PkmnName = nm[0];
    let PkmnNameSpecie = PkmnName.toLowerCase();
    let url = `https://pokeapi.co/api/v2/pokemon-species/${PkmnNameSpecie}`;

    const response = await fetch(url);
    const data = await response.json();
    const evoChainUrl = data.evolution_chain.url;

    const responseEvoChain = await fetch(evoChainUrl);
    const dataEvoChain = await responseEvoChain.json();

    // Función recursiva para construir la cadena de evolución
    function buildEvolutionChain(chainData) {
      let chain = [];
      const pokemonName = chainData.species.name;
      chain.push(pokemonName);

      if (chainData.evolves_to.length > 0) {
        // Si hay más etapas de evolución, llamamos a la función recursivamente
        for (const evolution of chainData.evolves_to) {
          const subChain = buildEvolutionChain(evolution);
          chain = chain.concat(subChain);
        }
      }

      return chain;
    }

    // Iniciar la construcción de la cadena de evolución desde el Pokémon actual
    const evolutionChain = buildEvolutionChain(dataEvoChain.chain);
    if (evolutionChain.length > 0 && evolutionChain.length <= 3) {
      pkmnObject.evolutionLines = {
        line: evolutionChain,
      };
    } else if (evolutionChain.length > 3) {
      let pkmnEvolutions = {
        evolutions: [],
      };
      let evos = [];
      evos.push(evolutionChain[0]);
      evos.push(evolutionChain[1]);
      evos.push(evolutionChain[2]);
      const evolutionLine1 = {
        line: evos,
      };
      pkmnEvolutions.evolutions.push(evolutionLine1);

      let evos2 = [];
      evos2.push(evolutionChain[0]);
      evos2.push(evolutionChain[1]);
      evos2.push(evolutionChain[3]);
      const evolutionLine2 = {
        line: evos2,
      };
      pkmnEvolutions.evolutions.push(evolutionLine2);

      pkmnObject.evolutionLines = pkmnEvolutions;
    }

    window.pkmn = pkmnObject;
    console.log(window.pkmn);
  } catch (error) {
    console.log(error);
    pkmnObject.evolutionLines = {};
    window.pkmn = pkmnObject;
    console.log(window.pkmn);
  }
}

async function getPkmnData(id) {
  let pkmnResponse = await fetch(url + id);
  let data = await pkmnResponse.json();
  let types = data.types;

  pkmnObject.types = [];

  types.forEach((type) => {
    pkmnObject.types.push(Capitalizer(type.type.name));
  });
  let habilities = data.abilities;

  let hab = [];
  habilities.forEach((hability) =>
    hab.push({ url: hability.ability.url, isHiden: hability.is_hidden })
  );

  let habDescription = null;
  pkmnObject.abilities = [];
  hab.forEach(async (hability) => {
    const data = await fetch(hability.url);
    const habilityData = await data.json();
    const entries = habilityData.effect_entries;
    let habDes = null;
    let habName = null;
    let isHidden = hability.isHiden;
    entries.forEach((entry) => {
      if (entry.language.name === "en") {
        habDes = entry.short_effect;
        habName = Capitalizer(habilityData.name);
        habDescription = {
          name: habName,
          description: habDes,
          isHidden: isHidden,
        };
        pkmnObject.abilities.push(habDescription);
      }
    });
  });

  let movesSet = [];
  let moves = data.moves;
  pkmnObject.moves = [];

  moves.forEach((mov) => {
    movesSet.push(mov.move.url);
  });

  movesSet.forEach(async (mov) => {
    const data = await fetch(mov);
    const movData = await data.json();
    const name = Capitalizer(movData.name);
    const accuracy = movData.accuracy;
    const power = movData.power;
    const clas = Capitalizer(movData.damage_class.name);
    const type = Capitalizer(movData.type.name);

    const move = {
      name: name,
      accuracy: accuracy,
      power: power,
      class: clas,
      type: type,
    };

    pkmnObject.moves.push(move);
  });

  let stats = data.stats;
  let pkmnStats = {};

  stats.forEach((st) => {
    let statName = Capitalizer(st.stat.name);
    let statValue = st.base_stat;

    pkmnStats[statName] = statValue;
  });

  pkmnObject.stats = pkmnStats;

  pkmnObject.weight = (data.weight / 10).toFixed(1) + " kg";
  pkmnObject.height = (data.height / 10).toFixed(1) + " m";

  let pokename = Capitalizer(data.name);
  pkmnObject.name = pokename;
  getEvoChain(pokename);
}

async function getPkmns(pkmns) {
  let $viewer = document.createElement("div");
  for (let i = 0; i < pkmns.length; i++) {
    try {
      let pkmnResponse = await fetch(pkmns[i].url);
      const pkmnData = await pkmnResponse.json();

      const $view = document.createElement("div");
      $view.classList.add("View");

      const $pkmnview = document.createElement("div");
      $pkmnview.classList.add("PkmnView");
      $pkmnview.classList.add("PkmnViewStyle");
      $pkmnview.classList.add("Center");
      $pkmnview.classList.add("Shadow4");

      const $pkmnimage = document.createElement("img");
      $pkmnimage.classList.add("PkmnSprite");
      $pkmnimage.src = pkmnData.sprites.front_default;

      $pkmnview.appendChild($pkmnimage);
      $view.appendChild($pkmnview);

      const $types = document.createElement("div");
      $types.classList.add("PkmnTypes");
      $types.classList.add("CenterBetween");

      if (pkmnData.types.length > 1) {
        let dataTypes = pkmnData.types;
        dataTypes.forEach((type) => {
          const $type = document.createElement("div");
          $type.classList.add("Type");
          $type.classList.add("Center");
          $type.classList.add("Shadow2");
          $type.classList.add(Capitalizer(type.type.name));
          const $typeP = document.createElement("p");
          if (type.type.name.length > 5) {
            $typeP.classList.add("Font12");
          } else if (type.type.name.length >= 8) {
            $typeP.classList.add("Font10");
          } else {
            $typeP.classList.add("Font14");
          }
          $typeP.textContent = Capitalizer(type.type.name);
          $type.appendChild($typeP);
          $types.appendChild($type);
        });
      } else {
        let dataTypes = pkmnData.types;
        dataTypes.forEach((type) => {
          const $type = document.createElement("div");
          $type.classList.add("Type");
          $type.classList.add("Center");
          $type.classList.add("Shadow2");
          $type.classList.add(Capitalizer(type.type.name));
          const $typeP = document.createElement("p");
          if (type.type.name.length > 5) {
            $typeP.classList.add("Font12");
          } else if (type.type.name.length >= 8) {
            $typeP.classList.add("Font10");
          } else {
            $typeP.classList.add("Font14");
          }
          $typeP.textContent = Capitalizer(type.type.name);
          $type.appendChild($typeP);
          $types.appendChild($type);
        });
        const $type = document.createElement("div");
        $type.classList.add("Type");
        $type.classList.add("Center");
        $type.classList.add("Shadow2");
        $type.classList.add("Null");
        const $typeP = document.createElement("p");
        $typeP.classList.add("Font14");
        $typeP.textContent = "Null";
        $type.appendChild($typeP);
        $types.appendChild($type);
      }

      $view.appendChild($types);

      const $info = document.createElement("div");
      $info.classList.add("PkmnInfo");
      $info.classList.add("CenterEvenly");
      $info.classList.add("Shadow2");

      const $pkmnNumber = document.createElement("div");
      const $pkmnName = document.createElement("div");

      $pkmnNumber.classList.add("PkmnNumber");
      $pkmnNumber.textContent = NumberFormater(pkmnData.id);

      $pkmnName.classList.add("PkmnName");
      $pkmnName.textContent = Capitalizer(pkmnData.name);

      $info.appendChild($pkmnNumber);
      $info.appendChild($pkmnName);

      $view.appendChild($info);
      $view.dataset.id = pkmnData.id;
      $viewer.appendChild($view);
      $viewer.classList.add("CenterColumn");
      $viewer.classList.add("Viewer");
    } catch (err) {
      console.log(err);
    }
  }
  $screen.innerHTML = "";
  $screen.appendChild($viewer);
  document.querySelectorAll(".View")[0].classList.add("Currently");
}

async function loadPkmns(url) {
  try {
    const response = await fetch(url);
    let data = await response.json();
    if (!response.ok)
      throw { status: response.status, statusText: response.statusText };
    $screen.innerHTML = "";
    createLoader();
    if (data.previous) {
      $select.setAttribute("href", `${data.previous}`);
    }
    if (data.next) {
      $start.setAttribute("href", `${data.next}`);
    }
    try {
      getPkmns(data.results);
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    let message = error.statusText || "Ocurrión un error";
    console.log(message);
  }
}

let currentlyCounter = 0;

const Slider = (btn) => {
  const $views = document.querySelectorAll(".View");

  if (btn.matches(".Left")) {
    $views[currentlyCounter].classList.remove("Currently");
    currentlyCounter--;
    if (currentlyCounter < 0) {
      currentlyCounter = $views.length - 1;
    }
    $views[currentlyCounter].classList.add("Currently");
  }
  if (btn.matches(".Right")) {
    $views[currentlyCounter].classList.remove("Currently");
    currentlyCounter++;
    if (currentlyCounter >= $views.length) {
      currentlyCounter = 0;
    }
    $views[currentlyCounter].classList.add("Currently");
  }
};

const ThemeChanger = (color) => {
  const $background = document.querySelector(".Background");
  $background.classList.remove($background.classList[2]);
  $background.classList.add(color);
  localStorage.setItem("Theme", color);
};

const PressSound = new Audio();
PressSound.src = "assets/press.mp3";
const $instructions = document.querySelector(".Instructions");
const $configuration = document.querySelector(".Config");
const $btns = document.querySelectorAll(".Btn");
const $soundConfig = document.querySelector(".BlockSound p");

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("Theme")) {
    ThemeChanger(localStorage.getItem("Theme"));
  }
  if (localStorage.getItem("ShowInstructions")) {
    $instructions.classList.add("Hide");
  } else {
    $instructions.classList.remove("Hide");
  }
  if (
    localStorage.getItem("sound") === "true" ||
    localStorage.getItem("sound") == "false"
  ) {
    if (localStorage.getItem("sound") === "true") {
      $soundConfig.textContent = "Sound: ON";
    } else {
      $soundConfig.textContent = "Sound: OFF";
    }
  } else if (localStorage.getItem("sound") == null) {
    localStorage.setItem("sound", "true");
  }
});

const PressedBtn = () => {
  PressSound.currentTime = 0;
  if (localStorage.getItem("sound") === "true") {
    PressSound.play();
  }
};

document.addEventListener("DOMContentLoaded", () => loadPkmns(url));

document.addEventListener("click", (e) => {
  if (e.target.matches(".LinkBtn")) {
    e.preventDefault();
    loadPkmns(e.target.getAttribute("href"));
    currentlyCounter = 0;
  }
  if (e.target.matches(".LinkBtn p") || e.target.matches(".LinkBtn p")) {
    e.preventDefault();
    let url = e.target.parentElement.getAttribute("href");
    loadPkmns(url);
    currentlyCounter = 0;
  }
  if (e.target.matches(".View")) {
    let pkmnId = e.target.dataset.id;
    pkmnObject.id = pkmnId;
    getPkmnData(pkmnId);
  }
  if (e.target.matches(".Left") || e.target.matches(".Right")) {
    e.preventDefault();
    Slider(e.target);
  }
  if (e.target.matches(".Left p") || e.target.matches(".Right p")) {
    e.preventDefault();
    let btn = e.target.parentElement;
    Slider(btn);
  }
  if (
    e.target.matches(".CloseAndRemember") ||
    e.target.matches(".CloseAndRemember p")
  ) {
    setTimeout(() => {
      $instructions.classList.add("Hide");
    }, 1000);
    localStorage.setItem("ShowInstructions", "true");
  }
  if (
    e.target.matches(".DontRememberClose") ||
    e.target.matches(".DontRememberClose p")
  ) {
    setTimeout(() => {
      $instructions.classList.add("Hide");
    }, 1000);
  }
  if (e.target.matches(".Btn") || e.target.matches(".Btn p")) {
    let btn = e.target;
    if (e.target.matches(".Btn p")) btn = e.target.parentElement;
    $btns.forEach((btn) => {
      btn.classList.remove("Active");
    });
    if (localStorage.getItem("sound") == "true") {
      PressedBtn();
    }
    btn.classList.add("Active");
    setTimeout(() => {
      btn.classList.remove("Active");
    }, 500);
  }
  if (e.target.matches(".Close") || e.target.matches(".Close p")) {
    setTimeout(() => {
      $configuration.classList.add("Hide");
    }, 1000);
  }
  if (e.target.matches(".Option") || e.target.matches(".Option p")) {
    $configuration.classList.remove("Hide");
  }
  if (
    e.target.matches(".ShowInstructions") ||
    e.target.matches(".ShowInstructions p")
  ) {
    $instructions.classList.remove("Hide");
    if (localStorage.getItem("ShowInstructions")) {
      $gotItBtn.classList.add("Hide");
    }
    $configuration.classList.add("Hide");
  }
  if (e.target.matches(".Social") || e.target.matches(".Social p")) {
    let social = e.target;
    if (e.target.matches(".Social p")) social = e.target.parentElement;

    let url = social.getAttribute("url");
    window.open(url, "_blank");
  }
  if (e.target.matches(".Color") || e.target.matches(".Color p")) {
    let color = e.target.classList[1];
    if (e.target.matches(".Color p"))
      color = e.target.parentElement.classList[1];
    ThemeChanger(color);
  }
  if (e.target.matches(".BlockSound") || e.target.matches(".BlockSound p")) {
    if (localStorage.getItem("sound") === "true") {
      localStorage.setItem("sound", "false");
      $soundConfig.innerHTML = "Sound: OFF";
    } else {
      localStorage.setItem("sound", "true");
      $soundConfig.innerHTML = "Sound: ON";
    }
  }
});
