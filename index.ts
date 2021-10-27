import axios from 'axios';

const loading = document.querySelector('#loading');
const allTasks = document.querySelector('#tasks');
const taskInput = document.querySelector('#new-task') as HTMLInputElement; // polje za unos nove stavke.
const addButton = document.querySelector('#add-button'); // dugme za dodavanje nove stavke
const incompleteTaskHolder = document.querySelector('#incomplete-tasks'); // lista stavki koje treba da se urade
const completedTasksHolder = document.querySelector('#completed-tasks'); // lista gotovih stavki

const url = 'https://serverless-todo.herokuapp.com/';


function init() {
  allTasks.classList.add('hidden');

  axios.get(url).then(res => {
    loading.classList.add('hidden');
    allTasks.classList.remove('hidden');

    res.data.forEach(todo => {
      const listItem = createNewTaskElement(todo.text, todo.id, todo.completed)
      if (todo.completed) {
        completedTasksHolder.append(listItem)
      } else {
        incompleteTaskHolder.append(listItem)
      }
    });

    Array.from(incompleteTaskHolder.children).forEach(child => {
      bindTaskEvents(child, taskCompleted);
    });

    Array.from(completedTasksHolder.children).forEach(child => {
      bindTaskEvents(child, taskIncomplete);
    });

    console.log('res', res);
  }).catch(err => {
    console.error(err);
  });
}

init();

function addTask() {
  const taskText = taskInput.value;
  if (taskText === '') return;

  console.log('Add Task...');

  axios.post(url, {
    text: taskText,
    completed: false
  }).then(res => {
    const id = res.data.id;
    const listItem = createNewTaskElement(taskText, id, false);

    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    taskInput.value = '';

  });
}

addButton.addEventListener('click', addTask);

// kreiranje nove stavke
function createNewTaskElement(taskString, id, completed) {
  const listItem = document.createElement('li');
  const checkBox = document.createElement('input'); //checkbox
  const label = document.createElement('label'); //label
  const editInput = document.createElement('input'); //text
  const editButton = document.createElement('button'); //edit button
  const deleteButton = document.createElement('button'); //delete button

  label.innerText = taskString;

  checkBox.type = 'checkbox';
  if (completed) checkBox.checked = true

  editInput.type = 'text';

  editButton.innerText = 'Izmeni'; //innerText encodes special characters, HTML does not.
  editButton.className = 'edit';
  deleteButton.innerText = 'Obriši';
  deleteButton.className = 'delete';

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  listItem.setAttribute('data-task-id', id);
  return listItem;
}

function editTask() {
  console.log('Edit Task...');
  console.log('Change \'edit\' to \'save\'');

  const listItem = this.parentNode;

  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const isSaving = listItem.classList.contains('editMode');
  if (isSaving) {
    const id = listItem.getAttribute('data-task-id');
    const newValue = editInput.value;

    axios.put(url + '/' + id, {
      text: newValue,
    }).then(res => {
      label.innerText = newValue;
    }).catch(console.error);

  } else {
    editInput.value = label.innerText;
  }

  listItem.classList.toggle('editMode');
}

function deleteTask() {
  console.log('Delete Task...');

  const listItem = this.parentNode;
  const ul = listItem.parentNode;
  const id = listItem.getAttribute('data-task-id')

  axios.delete(url + '/' + id).then(() => {
    ul.removeChild(listItem);
  }).catch(console.error)
}

function taskCompleted() {
  console.log('Complete Task...');

  const listItem = this.parentNode;
  const id = listItem.getAttribute('data-task-id')

  axios.put(url + '/' + id, {
    completed: true
  }).then(() => {
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
  }).catch(console.error)

}

function taskIncomplete() {
  console.log('Incomplete Task...');

  const listItem = this.parentNode;
  const id = listItem.getAttribute('data-task-id')

  axios.put(url + '/' + id, {
    completed: false
  }).then(() => {
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
  }).catch(console.error)
}

function bindTaskEvents(taskListItem, checkBoxEventHandler) {
  console.log('bind list item events');
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector('button.edit');
  const deleteButton = taskListItem.querySelector('button.delete');

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
}
