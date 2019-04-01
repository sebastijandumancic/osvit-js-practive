let listElement, searchbarElement, toDoItems;

function getJSON(filePath, callback) {
  listElement = document.getElementById('js-list');
  searchbarElement = document.getElementById('js-searchbar');

  fetch(filePath)
    .then(file => file.json())
    .then(json => {
      if (callback && typeof callback === 'function') {
        callback(json.todos);
      }
    })
    .catch(error => console.log(error));
}

function renderTodoCards(todos) {
  toDoItems = todos;

  todos.forEach(item => {
    listElement.innerHTML += renderToDoItem(item);
  });
}

function clearAllTodoCards() {
  listElement.innerHTML = '';
}

function filterTodoCards() {
  const searchQuery = searchbarElement.value;

  if (searchQuery.length > 3) {
    const filteredToDoItems = toDoItems.filter(todoItem =>
      todoItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    clearAllTodoCards();
    filteredToDoItems.forEach(item => {
      listElement.innerHTML += renderToDoItem(item);
    });

    return;
  }

  clearAllTodoCards();
  renderTodoCards(toDoItems);
}

function renderToDoItem(todo) {
  const { title, completed, date } = todo;
  const formatDate = () => {
    const dateObject = new Date(date);
    return `${dateObject.getDate()}.${dateObject.getMonth() +
      1}.${dateObject.getFullYear()}`;
  };

  return `<div class="${completed ? 'item item-finished' : 'item'}">
    <h2 class="item-title">${title}</h2>
    <p class="item-date">${formatDate(date)}</p>
  </div>`;
}

function addItem() {
  const { value } = searchbarElement;

  if (!value.length) {
    return;
  }

  const newToDo = {
    title: value,
    completed: false,
    date: new Date()
  };

  listElement.innerHTML += renderToDoItem(newToDo);
  searchbarElement.value = '';
}
