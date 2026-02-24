let todos = [];

function addTask(task) { todos.push(task); }
function viewTasks() { console.log(todos); }
function updateTask(i, task) { todos[i] = task; }
function deleteTask(i) { todos.splice(i, 1); }

addTask("Study JS");
addTask("Complete assignment");
viewTasks();

updateTask(0, "Study JavaScript deeply");
viewTasks();

deleteTask(1);
viewTasks();
