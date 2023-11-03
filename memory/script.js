if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("Registro Exitoso", reg))
      .catch((err) => console.log(err));
  });
} else {
  console.log("serviceWorker no soportado");
}
