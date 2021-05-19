function initControls()
{
  taskInput = document.getElementById("new-task");
  incompleteTasksHolder = document.getElementById("incomplete-tasks");
  completedTasksHolder = document.getElementById("completed-tasks");


  for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  }

  for (let i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  }


  todos = getTODO();
  todos.forEach((item) => {
    addTaskToDOM(item);
  })
}


function createNewTaskElement(todo)
{
  let listItem = document.createElement("li");
  let checkBox = document.createElement("input");
  let label = document.createElement("label");
  let editInput = document.createElement("input");
  let group = document.createElement("div");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  editInput.addEventListener("keyup", keyboardEnter);

  checkBox.type = "checkbox";
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = todo.name;

  group.appendChild(editButton);
  group.appendChild(deleteButton);

  listItem.setAttribute('id', todo.id);
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(group);

  return listItem;
}


function keyboardEnter(event)
{
  if (event.key === "Enter")
  {
    editTask(true, this.parentNode);
  }
  if (event.key === "Escape")
  {
    this.value = realValue;
    editTask(false, this.parentNode);
  }
}


function addTask()
{
  const listItemName = taskInput.value.trim();
  if (!listItemName.length)
  {
    alert("Task is required.");
    taskInput.focus();
    return;
  }

  let todo = {
    id: new Date().getTime(),
    name: listItemName,
    completed: false
  };


  let listItem = createNewTaskElement(todo)
  incompleteTasksHolder.appendChild(listItem)
  bindTaskEvents(listItem, taskCompleted)
  taskInput.value = "";
  saveTODO(todo);
}


function addTaskToDOM(todo)
{
  this.blur();
  let listItem = createNewTaskElement(todo);
  if (todo.completed)
  {
    bindTaskEvents(listItem, taskIncomplete);
    completedTasksHolder.appendChild(listItem);
  }
  else
  {
    bindTaskEvents(listItem, taskCompleted);
    incompleteTasksHolder.appendChild(listItem);
  }
}


function editTask(save=true, control)
{
  this.blur();
  let listItem = control || this.parentNode.parentNode;
  let editInput = listItem.querySelectorAll("input[type=text")[0];
  let label = listItem.querySelector("label");
  let button = listItem.getElementsByTagName("button")[0];

  let containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
    let listItemName = editInput.value.trim();
    if (!listItemName.length)
    {
      alert("Task is required.");
      return;
    }

    label.innerText = listItemName;
    button.innerText = "Edit";
    if (save)
    {
      updateTODO(listItem.id, listItemName);
    }
  } else {
     realValue = label.innerText;
     editInput.value = label.innerText;
     button.innerText = "Save";
     setTimeout(() => {
       editInput.focus();
     }, 150);
  }
  listItem.classList.toggle("editMode");
}


function deleteTask()
{
  this.blur();
  let yes = confirm("Are you sure you want to delete ?");
  if (!yes)
  {
    return;
  }

  let listItem = this.parentNode.parentNode;
  let ul = listItem.parentNode;
  ul.removeChild(listItem);
  deleteTODO(listItem.id);
}


function taskCompleted()
{
  const listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
  updateTODO(listItem.id, null, true);
}


function taskIncomplete()
{
  const listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  updateTODO(listItem.id, null, false);
}

function bindTaskEvents(taskListItem, checkBoxEventHandler) {
  const checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  const editButton = taskListItem.querySelectorAll("button.edit")[0];
  const deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
}


function saveTODO(todo)
{
  todos.push(todo);
  localStorage.setItem(KEY, JSON.stringify(todos));
}
function deleteTODO(id)
{
  todos = todos.filter((item) => item.id != id);
  localStorage.setItem(KEY, JSON.stringify(todos));
}
function updateTODO(id, name, isCompleted= null)
{
  for (let i = 0; i < todos.length; ++i)
  {
    let todo = todos[i];
    if (todo.id == id)
    {
      if (name)
      {
        todo.name = name;
      }
      if (isCompleted != null)
      {
        todo.completed = isCompleted;
      }
      break;
    }
  }
  localStorage.setItem(KEY, JSON.stringify(todos));
}
function getTODO()
{
  return JSON.parse(localStorage.getItem(KEY)) || [];
}


var taskInput;
var incompleteTasksHolder;
var completedTasksHolder;
var todos = [];
var realValue = "";
const KEY = "todo";
