const taskInput = document.querySelector('#new-task') as HTMLInputElement; // polje za unos nove stavke.
const addButton = document.querySelector('#add-button'); // dugme za dodavanje nove stavke
const incompleteTaskHolder = document.querySelector('#incomplete-tasks'); // lista stavki koje treba da se urade
const completedTasksHolder = document.querySelector('#completed-tasks'); // lista gotovih stavki

function addTask() {
  // preskoči stavke koje su prazne
  if (taskInput.value === '') return;

  console.log('Add Task...');
  // kreiranje novog elementa za stavku
  const listItem = createNewTaskElement(taskInput.value);

  // dodavanje stavke u listu stavki koje treba da se urade
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInput.value = '';
}

// postavljanje funkcije za obradu klik događaja
addButton.addEventListener('click', addTask);

// kreiranje nove stavke
function createNewTaskElement(taskString) {
  const listItem = document.createElement('li');
  // checkbox za unos
  const checkBox = document.createElement('input'); //checkbox
  // labela
  const label = document.createElement('label'); //label
  // polje za unos teksta
  const editInput = document.createElement('input'); //text
  // dugme za izmenu stavke
  const editButton = document.createElement('button'); //edit button
  // dugme za brisanje stavke
  const deleteButton = document.createElement('button'); //delete button

  label.innerText = taskString;

  // podešavanje elemenata
  checkBox.type = 'checkbox';
  editInput.type = 'text';

  editButton.innerText = 'Izmeni'; //innerText encodes special characters, HTML does not.
  editButton.className = 'edit';
  deleteButton.innerText = 'Obriši';
  deleteButton.className = 'delete';

  // dodavanje dece u element za stavku
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
}

// Izmeni postojeću stavku
function editTask() {
  console.log('Edit Task...');
  console.log('Change \'edit\' to \'save\'');

  const listItem = this.parentNode;

  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const containsClass = listItem.classList.contains('editMode');
  // proveriti da li je stavka već u stanju izmene
  if (containsClass) {
    // zamena labele sa tekstom iz polja za unos
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }

  // uključivanje ili isključivanje stanja izmene
  listItem.classList.toggle('editMode');
}

// Brisanje stavke
function deleteTask() {
  console.log('Delete Task...');

  const listItem = this.parentNode;
  const ul = listItem.parentNode;
  // brisanje stavke iz liste u DOM-u
  ul.removeChild(listItem);
}

// Markiranje stavke kao završenu
function taskCompleted() {
  console.log('Complete Task...');

  // dodavanje stavke u listu gotovih stavki
  const listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

// Markiranje stavke kao nezavršenu
function taskIncomplete() {
  console.log('Incomplete Task...');

  // dodavanje stavke u listu stavki koje treba da se urade
  const listItem = this.parentNode;
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}

function bindTaskEvents(taskListItem, checkBoxEventHandler) {
  console.log('bind list item events');
  //select ListItems children
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector('button.edit');
  const deleteButton = taskListItem.querySelector('button.delete');

  //Bind editTask to edit button.
  editButton.onclick = editTask;
  //Bind deleteTask to delete button.
  deleteButton.onclick = deleteTask;
  //Bind taskCompleted to checkBoxEventHandler.
  checkBox.onchange = checkBoxEventHandler;
}

Array.from(incompleteTaskHolder.children).forEach(child => {
  bindTaskEvents(child, taskCompleted);
});

Array.from(completedTasksHolder.children).forEach(child => {
  bindTaskEvents(child, taskIncomplete);
});
