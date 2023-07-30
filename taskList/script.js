/**
 * ? This code creates a simple To-Do list application.
 * * Users can enter tasks in the input field and click the "Set Task" button to add them to the uncompleted tasks list.
 * * Each task item in the uncompleted tasks list has a checkbox to mark it as completed and a delete button to remove it.
 * * When a task is marked as completed, it moves to the completed tasks list and vice versa if unchecked.
 * * Users can delete all tasks from both lists by clicking the "Delete Tasks" button.
 * TODO: Implement task persistence using local storage, so tasks persist even after refreshing the page.
 * TODO: Add animations and transitions to enhance the user experience.
 * TODO: Allow users to edit task items directly by clicking on them.
 * TODO: Implement drag and drop functionality to reorder tasks.
 * TODO: Add priority levels to tasks and allow users to sort tasks by priority.
 */

// ? variables for task creation
let task = null;
let newTask = null;

// ? app elements
/**
 * * input for tasks
 * * create task btn
 * * uncompleted tasks container
 * * completed tasks container
 * * delete tasks btn
 */
const preTask = document.querySelector(".todo-input");
const setTask = document.querySelector(".set-task-btn");
const uncompletedTasks = document.querySelector(".uncompleted-tasks");
const compledtedTasks = document.querySelector(".completed-tasks");
const deleteBtn = document.querySelector(".delete-btn");

// ? setTask function
/**
 * @description - Handles the click event for the setTask button
 * * Gets the task value from the preTask input element
 * * Creates a new div element with the task value
 * * Adds the new div element to the uncompletedTasks list
 * * Clears the preTask input element
 */

setTask.addEventListener("click", () => {
  task = preTask.value;
  newTask = document.createElement("div");
  newTask.classList.add("todo-item");
  newTask.innerHTML = `<span>
  <input type="checkbox" class="taskcheck">${task}
</span>
<a href="#">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708z"/> </svg>
</a>`;
  uncompletedTasks.appendChild(newTask);
  preTask.value = "";
});

// ? Handle change events for uncompletedTasks and completedTasks

/**
 * @description - Handles the change event for the uncompletedTasks list
 * * Gets the task item that was changed
 * * If the task item is checked, it moves it to the completedTasks list
 * * If the task item is unchecked, it moves it back to the uncompletedTasks list
 */

uncompletedTasks.addEventListener("change", (e) => {
  if (e.target.classList.contains("taskcheck")) {
    const taskItem = e.target.closest(".todo-item");
    const compledtedTask = uncompletedTasks.removeChild(taskItem);
    compledtedTasks.appendChild(compledtedTask);
  }
});

/**
 * @description - Handles the change event for the completedTasks list
 * * Gets the task item that was changed
 * * If the task item is checked, it moves it back to the uncompletedTasks list
 * * If the task item is unchecked, it stays in the completedTasks list
 */

compledtedTasks.addEventListener("change", (e) => {
  if (e.target.classList.contains("taskcheck")) {
    const taskItem = e.target.closest(".todo-item");
    const uncompletedTask = compledtedTasks.removeChild(taskItem);
    uncompletedTasks.appendChild(uncompletedTask);
  }
});

// ? Handle click events for uncompletedTasks and completedTasks

/**
 * @description - Handles the click event for the uncompletedTasks list
 * * Gets the task item that was clicked
 * * If the clicked item contains the bi-x class, it removes it from the list
 */

uncompletedTasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("bi-x")) {
    const taskItem = e.target.closest(".todo-item");
    uncompletedTasks.removeChild(taskItem);
  }
});

/**
 * @description - Handles the click event for the completedTasks list
 * * Gets the task item that was clicked
 * * If the clicked item contains the bi-x class, it removes it from the list
 */

compledtedTasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("bi-x")) {
    const taskItem = e.target.closest(".todo-item");
    compledtedTasks.removeChild(taskItem);
  }
});

// ? Delete all tasks when the delete button is clicked
deleteBtn.addEventListener("click", () => {
  const allTask = document.querySelectorAll(".todo-item");
  allTask.forEach((task) => {
    task.remove();
  });
});
