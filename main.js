let listElement, searchbarElement;

function getTodosFromLS() {
  const items = localStorage.getItem('todos');
  return JSON.parse(items);
}

function setTodosInLS(item) {
  localStorage.setItem('todos', JSON.stringify(item));
}

function getJSON(filePath, callback) {
  listElement = document.getElementById('js-list');
  searchbarElement = document.getElementById('js-searchbar');

  fetch(filePath)
    .then(file => file.json())
    .then(json => {
      const toDoItems = getTodosFromLS();
      if (!toDoItems) {
        setTodosInLS(json.todos);
      }

      if (callback && typeof callback === 'function') {
        callback(json.todos);
      }
    })
    .catch(error => console.log(error));
}

function renderTodoCards(toDoItems) {
  toDoItems.sort(sortByDateAsc).forEach(item => {
    listElement.innerHTML += renderToDoItem(item);
  });
}

function sortByDateAsc(a, b) {
  const first = new Date(a.date);
  const second = new Date(b.date);

  if (first && second) {
    return first.getTime() - second.getTime();
  }
}

function sortByDateDesc(a, b) {
  const first = new Date(a.date);
  const second = new Date(b.date);

  if (first && second) {
    return second.getTime() - first.getTime();
  }
}

function clearAllTodoCards() {
  listElement.innerHTML = '';
}

function searchTodos() {
  const searchQuery = searchbarElement.value;
  const toDoItems = getTodosFromLS();

  if (searchQuery.length > 3) {
    const filteredToDoItems = toDoItems.filter(todoItem =>
      todoItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    clearAllTodoCards();
    filteredToDoItems.sort(sortByDateAsc).forEach(item => {
      listElement.innerHTML += renderToDoItem(item);
    });

    return;
  }

  clearAllTodoCards();
  renderTodoCards(toDoItems);
}

function renderToDoItem(todo) {
  const { id, title, completed, date } = todo;
  const formatDate = () => {
    const dateObject = new Date(date);
    return `${dateObject.getDate()}.${dateObject.getMonth() +
      1}.${dateObject.getFullYear()}`;
  };

  return `<div data-moja-vrijednost="${id}" onclick="setCompletedStatus(event)" class="${
    completed ? 'item item-finished' : 'item'
  }">
    <h2 class="item-title">${title}</h2>
    <p class="item-date">${formatDate(date)}</p>
  </div>`;
}

function setCompletedStatus(event) {
  const { mojaVrijednost } = event.currentTarget.dataset;

  let toDoItems = getTodosFromLS();
  toDoItems = toDoItems.map(item => {
    if (item.id === mojaVrijednost) {
      item.completed = !!!item.completed;
      event.currentTarget.classList.toggle('item-finished');
    }

    return item;
  });

  setTodosInLS(toDoItems);
}

function addItem() {
  const { value } = searchbarElement;

  if (!value.length) {
    return;
  }

  // Dodati ID
  const newToDo = {
    id: '',
    title: value,
    completed: false,
    date: new Date()
  };

  listElement.innerHTML += renderToDoItem(newToDo);
  renderTodoCards(toDoItems);
  searchbarElement.value = '';
}

function showFilteredByDate(isUpcoming) {
  const toDoItems = getTodosFromLS();
  const filteredItems = toDoItems.filter(item => {
    const currentDateTime = new Date().getTime();
    const itemDate = new Date(item.date).getTime();

    return isUpcoming ? itemDate > currentDateTime : itemDate < currentDateTime;
  });

  clearAllTodoCards();
  renderTodoCards(filteredItems);
}

function showFilteredByCompletion(isCompleted) {
  const toDoItems = getTodosFromLS();
  const filteredItems = toDoItems.filter(item =>
    isCompleted ? item.completed : !item.completed
  );

  clearAllTodoCards();
  renderTodoCards(filteredItems);
}

function showAll() {
  const toDoItems = getTodosFromLS();
  clearAllTodoCards();
  renderTodoCards(toDoItems);
}
