/**
 * ? This code creates a simple To-Do list application.
 * * Users can enter tasks in the input field and click the "Set Task" button to add them to the uncompleted tasks list.
 * * Each task item in the uncompleted tasks list has a checkbox to mark it as completed and a delete button to remove it.
 * * When a task is marked as completed, it moves to the completed tasks list and vice versa if unchecked.
 * * Users can delete all tasks from both lists by clicking the "Delete Tasks" button.
 * TODO: Add animations and transitions to enhance the user experience.
 * TODO: Allow users to edit task items directly by clicking on them.
 * TODO: Implement drag and drop functionality to reorder tasks.
 * TODO: Allow users to sort tasks by priority.
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
const typeBtn = document.querySelector(".type-btn");

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
  type = typeBtn.value;
  newTask = document.createElement("div");
  newTask.classList.add("todo-item");
  newTask.classList.add(type);
  newTask.innerHTML = `<span>
  <input type="checkbox" class="taskcheck">${task}
</span>
<p class="Delete">X</p>`;
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
  if (e.target.classList.contains("Delete")) {
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
  if (e.target.classList.contains("Delete")) {
    const taskItem = e.target.closest(".todo-item");
    compledtedTasks.removeChild(taskItem);
  }
});

// ? Delete all task function
const clear = () => {
  const allTask = document.querySelectorAll(".todo-item");
  allTask.forEach((task) => {
    task.remove();
  });
};

// ? Delete all tasks when the delete button is clicked
deleteBtn.addEventListener("click", clear);

// ! local storage functions //

// ? Get the buttons to save and load tasks
const saveBtn = document.querySelector(".save-btn");
const loadBtn = document.querySelector(".load-btn");

//? Save tasks to local storage
/**
 * * Select all the tasks from the document
 * * Initialize an empty array to store the tasks
 * * Loop through the tasks to create the task object
 * * Push the task object to the array
 * * Format the tasks array to a JSON
 * * Store tasks in the local storage
 */
const saveTasks = () => {
  const allTask = document.querySelectorAll(".todo-item");
  const tasks = [];

  allTask.forEach((task) => {
    const taskObject = {
      task: task.querySelector("span").textContent,
      type: task.classList[1],
      completed: task.querySelector("input").checked,
    };
    tasks.push(taskObject);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// ? Load tasks from local storage
/**
 * * Clear previous content to prevent duplicates in the task list body
 * * Retrieves task data from local storage
 * * Checks if task data exist
 * * Parse task data
 * * Loop through task data to create the elements
 * * - If the task is completed append to the completed tasks container
 * * - If not appends it to the uncompleted tasks container
 */
const loadTasks = () => {
  clear();
  const tasks = localStorage.getItem("tasks");

  if (tasks) {
    const tasksData = JSON.parse(tasks);
    tasksData.forEach((task) => {
      const newTask = document.createElement("div");
      newTask.classList.add("todo-item");
      newTask.classList.add(task.type);
      newTask.innerHTML = `<span>
      <input type="checkbox" class="taskcheck">${task.task}
    </span>
    <p class="Delete">X</p>`;
      if (task.completed) {
        newTask.querySelector("input").checked = true;
        compledtedTasks.appendChild(newTask);
      } else {
        uncompletedTasks.appendChild(newTask);
      }
    });
  }
};

// ? Add event listeners to the buttons
saveBtn.addEventListener("click", saveTasks);
loadBtn.addEventListener("click", loadTasks);
