//definimos las variables principales una para obtener la tarea y otra para crear el elemento de la tarea, ambas iniciadas en nulo
let task = null;
let newTask = null;
//construimos los elementos, el input donde se escribira la tarea, el boton para crear la tarea y los contenedores de las tareas completas e incompletas
const preTask = document.querySelector(".todo-input");
const setTask = document.querySelector(".set-task-btn");
const uncompletedTasks = document.querySelector(".uncompleted-tasks");
const compledtedTasks = document.querySelector(".completed-tasks");
const deleteBtn = document.querySelector(".delete-btn");
//creamos una escucha para cuando se presione el boton para crear la tarea
setTask.addEventListener("click", () => {
  //primero obtenemos el contenido del input para crear la tarea
  task = preTask.value;
  //luego creamos el elemento para la tarea
  newTask = document.createElement("div");
  //le aignamos una clase para poder manipularlo
  newTask.classList.add("todo-item");
  //y le agregamos la tarea, con su casilla de verificacion y el svg 'X' para poderlo eliminar
  newTask.innerHTML = `<span>
  <input type="checkbox" class="taskcheck">${task}
</span>
<a href="#">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
</a>`;
  //por ultimo agregamos este elemento nuevo de tarea a las tareas incompletas y devolvemos el valor del input a "" para dejarlo limpio
  uncompletedTasks.appendChild(newTask);
  preTask.value = "";
});
//creamos las funciones para mover las tareas segun esten completas o incompletas
//agregamos una escucha para el contenedor
uncompletedTasks.addEventListener("change", (e) => {
  //si el objeto en el que esta ocurriendo un cambio tiene la clase 'taskcheck' entonces ejecutamos la funcion
  if (e.target.classList.contains("taskcheck")) {
    //creamos el objeto tarea, utlizamos .closest() para encontrar el elemento mas cercano con la clase 'todo-item'
    const taskItem = e.target.closest(".todo-item");
    //una vez tenemos ese elemento, lo eliminamos del contenedor de tareas incompletas y lo guardamos como tarea completa
    const compledtedTask = uncompletedTasks.removeChild(taskItem);
    //luego agregamos la tarea eliminada al contenedor de tareas completas
    compledtedTasks.appendChild(compledtedTask);
  }
});
//realizamos lo mismo pero para pasar una tarea completa a una imcompleta utilizando la misma funcion
compledtedTasks.addEventListener("change", (e) => {
  if (e.target.classList.contains("taskcheck")) {
    const taskItem = e.target.closest(".todo-item");
    const uncompletedTask = compledtedTasks.removeChild(taskItem);
    uncompletedTasks.appendChild(uncompletedTask);
  }
});
//creamos las funciones para eliminar tareas esten completas o no
//creamos una escucha para los contenedores si se hace click
uncompletedTasks.addEventListener("click", (e) => {
  //si el objeto contiene la clase 'bi-x' entonces se ejecuta la funcion
  if (e.target.classList.contains("bi-x")) {
    //creamos un objeto tarea y buscamos el elemento con la clase 'todo-item' mas cercano
    const taskItem = e.target.closest(".todo-item");
    //luego removemos ese objeto tarea
    uncompletedTasks.removeChild(taskItem);
  }
});
//la misma funcion para el otro contenedor
compledtedTasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("bi-x")) {
    const taskItem = e.target.closest(".todo-item");
    compledtedTasks.removeChild(taskItem);
  }
});
//funcion para borrar todas las tareas, creamos un escucha para el boton C al hacer click
deleteBtn.addEventListener("click", () => {
  //construimos un objeto que tenga todas las tareas
  const allTask = document.querySelectorAll(".todo-item");
  //removemos todas las tareas del objeto
  allTask.forEach((task) => {
    task.remove();
  });
});
